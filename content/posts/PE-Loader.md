---
title: Coding a PE Loader in C
date: 2024-09-02
description: I wanted to know what Windows actually does with an EXE before it runs, so I wrote a small PE loader in C and pulled the whole process apart.
keywords: PE loader, Portable Executable, C, WinAPI, malware development, Ilia Mirzaali, rmxzy, process injection, DLL injection
author: Ilia Mirzaali
tags:
    - "C"
    - "MalwareDev"
    - "WinAPI"
thumbnail: /images/pe-loader-cover-v3.png
accent: "#bd4f36"
categories:
  - Security
---
# Why Write a PE Loader?

PE loader malware exploits the Windows Portable Executable format to inject and execute malicious code stealthily. It operates in-memory, often evading detection by antivirus software. Using techniques like process hollowing and DLL injection, it enables attackers to launch ransomware, steal data, or move laterally within networks. Strengthened endpoint protection and careful file handling are key defenses against this threat.

## What does it do exactly?

A PE Loader is a program that loads, parses, and executes a PE file (such as an `EXE` or `DLL`). The following code implements a simple PE Loader that reads a PE file, performs necessary loading steps, including reading headers, allocating memory, mapping sections, resolving imports, applying relocations, and executing the PE file.


## Code Implementation

Below is the full implementation of a simple PE Loader in C using the Win32 API.


### **Main Structure**

```c
#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>
#include <windows.h>

// Function prototypes
void LoadPEFile(const char* filePath);
void ParseHeaders(const char* peBuffer, IMAGE_NT_HEADERS** ntHeaders);
void* AllocateMemoryForImage(IMAGE_NT_HEADERS* ntHeaders);
void MapSections(const char* peBuffer, IMAGE_NT_HEADERS* ntHeaders, void* baseAddress);
void ResolveImports(IMAGE_NT_HEADERS* ntHeaders, void* baseAddress);
void ApplyRelocations(IMAGE_NT_HEADERS* ntHeaders, void* baseAddress, DWORD_PTR delta);
void ExecutePE(IMAGE_NT_HEADERS* ntHeaders, void* baseAddress);

int main(int argc, char* argv[]) {
    if (argc != 2) {
        printf("Usage: %s <PE file path>\n", argv[0]);
        return 1;
    }

    LoadPEFile(argv[1]);
    return 0;
}
```
---

### 1. **LoadPEFile** Function

This function reads the PE file from the disk and begins the loading process.

```c
void LoadPEFile(const char* filePath) {
    FILE* peFile = fopen(filePath, "rb");
    if (!peFile) {
        printf("Failed to open PE file: %s\n", filePath);
        exit(1);
    }

    // Get the size of the file
    fseek(peFile, 0, SEEK_END);
    long fileSize = ftell(peFile);
    fseek(peFile, 0, SEEK_SET);

    // Allocate memory and read the file into the buffer
    char* peBuffer = (char*)malloc(fileSize);
    fread(peBuffer, 1, fileSize, peFile);
    fclose(peFile);

    // Parse headers and load sections
    IMAGE_NT_HEADERS* ntHeaders;
    ParseHeaders(peBuffer, &ntHeaders);
    void* baseAddress = AllocateMemoryForImage(ntHeaders);
    MapSections(peBuffer, ntHeaders, baseAddress);
    ResolveImports(ntHeaders, baseAddress);

    // Handle relocations
    DWORD_PTR delta = (DWORD_PTR)baseAddress - ntHeaders->OptionalHeader.ImageBase;
    if (delta != 0) {
        ApplyRelocations(ntHeaders, baseAddress, delta);
    }

    ExecutePE(ntHeaders, baseAddress);
    free(peBuffer);
}
````
---

### 2. **ParseHeaders** Function

This function reads the PE headers from the PE file buffer and verifies whether the PE file is valid.

```c
void ParseHeaders(const char* peBuffer, IMAGE_NT_HEADERS** ntHeaders) {
    // DOS Header
    IMAGE_DOS_HEADER* dosHeader = (IMAGE_DOS_HEADER*)peBuffer;
    if (dosHeader->e_magic != IMAGE_DOS_SIGNATURE) {
        printf("Invalid DOS signature.\n");
        exit(1);
    }

    // NT Headers
    *ntHeaders = (IMAGE_NT_HEADERS*)(peBuffer + dosHeader->e_lfanew);
    if ((*ntHeaders)->Signature != IMAGE_NT_SIGNATURE) {
        printf("Invalid PE signature.\n");
        exit(1);
    }

    printf("Valid PE file.\n");
}
```
---

### 3. **AllocateMemoryForImage** Function

This function allocates memory for the PE image. It first attempts to allocate memory at the preferred base address specified in the PE file, and if that fails, it allocates memory at any available address.

```c
void* AllocateMemoryForImage(IMAGE_NT_HEADERS* ntHeaders) {
    void* baseAddress = VirtualAlloc((LPVOID)ntHeaders->OptionalHeader.ImageBase,
        ntHeaders->OptionalHeader.SizeOfImage,
        MEM_COMMIT | MEM_RESERVE,
        PAGE_EXECUTE_READWRITE);

    if (!baseAddress) {
        baseAddress = VirtualAlloc(NULL,
            ntHeaders->OptionalHeader.SizeOfImage,
            MEM_COMMIT | MEM_RESERVE,
            PAGE_EXECUTE_READWRITE);
    }

    if (!baseAddress) {
        printf("Failed to allocate memory for image.\n");
        exit(1);
    }

    printf("Memory allocated at: 0x%p\n", baseAddress);
    return baseAddress;
}
```
---

### 4. **MapSections** Function

This function maps the sections of the PE file into the allocated memory. It first copies the headers to the allocated memory and then maps the sections from the PE file to the appropriate addresses.

```c
void MapSections(const char* peBuffer, IMAGE_NT_HEADERS* ntHeaders, void* baseAddress) {
    memcpy(baseAddress, peBuffer, ntHeaders->OptionalHeader.SizeOfHeaders);

    IMAGE_SECTION_HEADER* sectionHeader = IMAGE_FIRST_SECTION(ntHeaders);
    for (int i = 0; i < ntHeaders->FileHeader.NumberOfSections; i++, sectionHeader++) {
        void* dest = (char*)baseAddress + sectionHeader->VirtualAddress;
        void* src = (char*)peBuffer + sectionHeader->PointerToRawData;
        memcpy(dest, src, sectionHeader->SizeOfRawData);
        printf("Mapped section: %s to 0x%p\n", sectionHeader->Name, dest);
    }
}
```
---

### 5. **ResolveImports** Function

This function resolves the imports of the PE file. It extracts the names of the required DLLs and loads the necessary functions from those DLLs.

```c
void ResolveImports(IMAGE_NT_HEADERS* ntHeaders, void* baseAddress) {
    IMAGE_IMPORT_DESCRIPTOR* importDesc = (IMAGE_IMPORT_DESCRIPTOR*)((char*)baseAddress +
        ntHeaders->OptionalHeader.DataDirectory[IMAGE_DIRECTORY_ENTRY_IMPORT].VirtualAddress);

    while (importDesc->Name) {
        char* dllName = (char*)baseAddress + importDesc->Name;
        HMODULE hModule = LoadLibraryA(dllName);

        if (!hModule) {
            printf("Failed to load library: %s\n", dllName);
            exit(1);
        }

        IMAGE_THUNK_DATA* origFirstThunk = (IMAGE_THUNK_DATA*)((char*)baseAddress + importDesc->OriginalFirstThunk);
        IMAGE_THUNK_DATA* firstThunk = (IMAGE_THUNK_DATA*)((char*)baseAddress + importDesc->FirstThunk);

        while (origFirstThunk->u1.AddressOfData) {
            IMAGE_IMPORT_BY_NAME* importByName = (IMAGE_IMPORT_BY_NAME*)((char*)baseAddress + origFirstThunk->u1.AddressOfData);
            FARPROC functionAddress = GetProcAddress(hModule, (LPCSTR)importByName->Name);

            if (!functionAddress) {
                printf("Failed to resolve import: %s\n", importByName->Name);
                exit(1);
            }

            firstThunk->u1.Function = (DWORD_PTR)functionAddress;
            origFirstThunk++;
            firstThunk++;
        }
        importDesc++;
    }

    printf("Imports resolved.\n");
}
```
---

### 6. **ApplyRelocations** Function

If the PE file is loaded at an address different from its preferred address, this function applies the necessary relocations to ensure that absolute addresses in the PE file work correctly.

```c
void ApplyRelocations(IMAGE_NT_HEADERS* ntHeaders, void* baseAddress, DWORD_PTR delta) {
    if (delta == 0) return;

    IMAGE_BASE_RELOCATION* reloc = (IMAGE_BASE_RELOCATION*)((char*)baseAddress +
        ntHeaders->OptionalHeader.DataDirectory[IMAGE_DIRECTORY_ENTRY_BASERELOC].VirtualAddress);

    while (reloc->VirtualAddress) {
        WORD* relocItem = (WORD*)((char*)reloc + sizeof(IMAGE_BASE_RELOCATION));
        int numRelocs = (reloc->SizeOfBlock - sizeof(IMAGE_BASE_RELOCATION)) / sizeof(WORD);

        for (int i = 0; i < numRelocs; i++) {
            if ((relocItem[i] >> 12) == IMAGE_REL_BASED_HIGHLOW) {
                DWORD* patchAddr = (DWORD*)((char*)baseAddress + reloc->VirtualAddress + (relocItem[i] & 0xFFF));
                *patchAddr += (DWORD)delta;
            }
        }
        reloc = (IMAGE_BASE_RELOCATION*)((char*)reloc + reloc->SizeOfBlock);
    }

    printf("Relocations applied.\n");
}
```
---

### 7. **ExecutePE** Function

This function locates the entry point of the PE file and executes it.

```c
void ExecutePE(IMAGE_NT_HEADERS* ntHeaders, void* baseAddress) {
    void (*entryPoint)() = (void (*)())((char*)baseAddress + ntHeaders->OptionalHeader.AddressOfEntryPoint);
    printf("Executing PE at entry point: 0x%p\n", entryPoint

);
    entryPoint();
}
``` 
---

## Full Simple PE Loader **(x64)**
```c
#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>
#include <windows.h>

// Function prototypes
void LoadPEFile(const char* filePath);
void ParseHeaders(const char* peBuffer, IMAGE_NT_HEADERS** ntHeaders);
void* AllocateMemoryForImage(IMAGE_NT_HEADERS* ntHeaders);
void MapSections(const char* peBuffer, IMAGE_NT_HEADERS* ntHeaders, void* baseAddress);
void ResolveImports(IMAGE_NT_HEADERS* ntHeaders, void* baseAddress);
void ApplyRelocations(IMAGE_NT_HEADERS* ntHeaders, void* baseAddress, DWORD_PTR delta);
void ExecutePE(IMAGE_NT_HEADERS* ntHeaders, void* baseAddress);

int main(int argc, char* argv[]) {
    if (argc != 2) {
        printf("Usage: %s <PE file path>\n", argv[0]);
        return 1;
    }

    LoadPEFile(argv[1]);
    return 0;
}

void LoadPEFile(const char* filePath) {
    FILE* peFile = fopen(filePath, "rb");
    if (!peFile) {
        printf("Failed to open PE file: %s\n", filePath);
        exit(1);
    }

    // Get the size of the file
    fseek(peFile, 0, SEEK_END);
    long fileSize = ftell(peFile);
    fseek(peFile, 0, SEEK_SET);

    // Allocate memory and read the file into the buffer
    char* peBuffer = (char*)malloc(fileSize);
    fread(peBuffer, 1, fileSize, peFile);
    fclose(peFile);

    // Parse headers and load sections
    IMAGE_NT_HEADERS* ntHeaders;
    ParseHeaders(peBuffer, &ntHeaders);
    void* baseAddress = AllocateMemoryForImage(ntHeaders);
    MapSections(peBuffer, ntHeaders, baseAddress);
    ResolveImports(ntHeaders, baseAddress);

    // Handle relocations
    DWORD_PTR delta = (DWORD_PTR)baseAddress - ntHeaders->OptionalHeader.ImageBase;
    if (delta != 0) {
        ApplyRelocations(ntHeaders, baseAddress, delta);
    }

    ExecutePE(ntHeaders, baseAddress);
    free(peBuffer);
}

void ParseHeaders(const char* peBuffer, IMAGE_NT_HEADERS** ntHeaders) {
    // DOS Header
    IMAGE_DOS_HEADER* dosHeader = (IMAGE_DOS_HEADER*)peBuffer;
    if (dosHeader->e_magic != IMAGE_DOS_SIGNATURE) {
        printf("Invalid DOS signature.\n");
        exit(1);
    }

    // NT Headers
    *ntHeaders = (IMAGE_NT_HEADERS*)(peBuffer + dosHeader->e_lfanew);
    if ((*ntHeaders)->Signature != IMAGE_NT_SIGNATURE) {
        printf("Invalid PE signature.\n");
        exit(1);
    }

    printf("Valid PE file.\n");
}

void* AllocateMemoryForImage(IMAGE_NT_HEADERS* ntHeaders) {
    // Allocate memory for the image, aligned to the preferred base address
    void* baseAddress = VirtualAlloc((LPVOID)ntHeaders->OptionalHeader.ImageBase,
        ntHeaders->OptionalHeader.SizeOfImage,
        MEM_COMMIT | MEM_RESERVE,
        PAGE_EXECUTE_READWRITE);

    if (!baseAddress) {
        // If allocation at preferred address fails, allocate memory at any available address
        baseAddress = VirtualAlloc(NULL,
            ntHeaders->OptionalHeader.SizeOfImage,
            MEM_COMMIT | MEM_RESERVE,
            PAGE_EXECUTE_READWRITE);
    }

    if (!baseAddress) {
        printf("Failed to allocate memory for image.\n");
        exit(1);
    }

    printf("Memory allocated at: 0x%p\n", baseAddress);
    return baseAddress;
}

void MapSections(const char* peBuffer, IMAGE_NT_HEADERS* ntHeaders, void* baseAddress) {
    // Copy the headers to the allocated memory
    memcpy(baseAddress, peBuffer, ntHeaders->OptionalHeader.SizeOfHeaders);

    // Map sections to memory
    IMAGE_SECTION_HEADER* sectionHeader = IMAGE_FIRST_SECTION(ntHeaders);
    for (int i = 0; i < ntHeaders->FileHeader.NumberOfSections; i++, sectionHeader++) {
        void* dest = (char*)baseAddress + sectionHeader->VirtualAddress;
        void* src = (char*)peBuffer + sectionHeader->PointerToRawData;
        memcpy(dest, src, sectionHeader->SizeOfRawData);
        printf("Mapped section: %s to 0x%p\n", sectionHeader->Name, dest);
    }
}

void ResolveImports(IMAGE_NT_HEADERS* ntHeaders, void* baseAddress) {
    IMAGE_IMPORT_DESCRIPTOR* importDesc = (IMAGE_IMPORT_DESCRIPTOR*)((char*)baseAddress +
        ntHeaders->OptionalHeader.DataDirectory[IMAGE_DIRECTORY_ENTRY_IMPORT].VirtualAddress);

    while (importDesc->Name) {
        char* dllName = (char*)baseAddress + importDesc->Name;
        HMODULE hModule = LoadLibraryA(dllName);

        if (!hModule) {
            printf("Failed to load library: %s\n", dllName);
            exit(1);
        }

        IMAGE_THUNK_DATA* origFirstThunk = (IMAGE_THUNK_DATA*)((char*)baseAddress + importDesc->OriginalFirstThunk);
        IMAGE_THUNK_DATA* firstThunk = (IMAGE_THUNK_DATA*)((char*)baseAddress + importDesc->FirstThunk);

        while (origFirstThunk->u1.AddressOfData) {
            IMAGE_IMPORT_BY_NAME* importByName = (IMAGE_IMPORT_BY_NAME*)((char*)baseAddress + origFirstThunk->u1.AddressOfData);
            FARPROC functionAddress = GetProcAddress(hModule, (LPCSTR)importByName->Name);

            if (!functionAddress) {
                printf("Failed to resolve import: %s\n", importByName->Name);
                exit(1);
            }

            firstThunk->u1.Function = (DWORD_PTR)functionAddress;
            origFirstThunk++;
            firstThunk++;
        }
        importDesc++;
    }

    printf("Imports resolved.\n");
}

void ApplyRelocations(IMAGE_NT_HEADERS* ntHeaders, void* baseAddress, DWORD_PTR delta) {
    if (delta == 0) return;

    IMAGE_BASE_RELOCATION* reloc = (IMAGE_BASE_RELOCATION*)((char*)baseAddress +
        ntHeaders->OptionalHeader.DataDirectory[IMAGE_DIRECTORY_ENTRY_BASERELOC].VirtualAddress);

    while (reloc->VirtualAddress) {
        WORD* relocItem = (WORD*)((char*)reloc + sizeof(IMAGE_BASE_RELOCATION));
        int numRelocs = (reloc->SizeOfBlock - sizeof(IMAGE_BASE_RELOCATION)) / sizeof(WORD);

        for (int i = 0; i < numRelocs; i++) {
            if ((relocItem[i] >> 12) == IMAGE_REL_BASED_HIGHLOW) {
                DWORD* patchAddr = (DWORD*)((char*)baseAddress + reloc->VirtualAddress + (relocItem[i] & 0xFFF));
                *patchAddr += (DWORD)delta;
            }
        }
        reloc = (IMAGE_BASE_RELOCATION*)((char*)reloc + reloc->SizeOfBlock);
    }

    printf("Relocations applied.\n");
}

void ExecutePE(IMAGE_NT_HEADERS* ntHeaders, void* baseAddress) {
    // Get the entry point address and call it
    void (*entryPoint)() = (void (*)())((char*)baseAddress + ntHeaders->OptionalHeader.AddressOfEntryPoint);
    printf("Executing PE at entry point: 0x%p\n", entryPoint);
    entryPoint();
}
``` 
--- 

### **Important Note**

There is no PE loader that can load all PEs, the most logical way is to write a custom loader for an EXE (in malware development), for example, the above code cannot load Notepad.exe, but it can load clac.exe, the reason for this The difference is the type of PE contents.


## Conclusion
This simple PE Loader demonstrates the basic steps required to load and execute a PE file in Windows. In real-world scenarios, more advanced PE Loaders might include additional features like manipulating internal PE structures, more complex header analysis, and various security mechanisms. These types of tools can be used for security testing, malware analysis, or custom software loading and execution.
