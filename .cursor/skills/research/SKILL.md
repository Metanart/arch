---
name: research
description: Analyze and explain architecture, workflows, and data flows in a TypeScript application using React, Redux Toolkit, Electron, and TypeORM.
---

# Research Skill

## Purpose

This skill is used to explore and explain a codebase.

It helps developers understand:

- application architecture
- module responsibilities
- workflows and use cases
- data flow across layers
- how a feature works internally

Typical use cases:

- learning a new codebase
- tracing how data flows from UI to database
- understanding a business workflow
- investigating how a specific feature works
- identifying architectural boundaries

This skill **does not generate new code**.

Its purpose is **analysis and explanation**.

---

# Research Procedure

Follow the steps in order.

Do not jump directly to conclusions.

---

## 1. Identify the Entry Point

Determine the starting point of the investigation.

Possible entry points:

- React component
- Redux slice
- service function
- Electron IPC handler
- API endpoint
- database repository
- specific entity or domain object

If the user provides a file or symbol — start there.

If the entry point is unclear, infer it from:

- routing
- component usage
- Redux connections
- IPC handlers

---

## 2. Map the Architectural Layers

Identify the layers involved in the workflow.

Typical architecture in this stack:

UI Layer

- React components
- hooks
- containers

State Layer

- Redux Toolkit slices
- selectors
- async thunks

Application Layer

- services
- orchestration logic
- workflow coordination

Persistence Layer

- TypeORM repositories
- entities
- database queries

Electron Boundary

- IPC handlers
- main process services

List which layers participate in the workflow.

---

## 3. Trace the Data Flow

Follow how data moves across the system.

Typical flow:

User Action  
→ React Component  
→ Redux Action / Thunk  
→ Service Layer  
→ Repository / TypeORM  
→ Database

Or in Electron apps:

Renderer  
→ IPC  
→ Main Process  
→ Services  
→ Database / File System

For each step identify:

- function name
- module
- responsibility

Explain how data changes across the steps.

---

## 4. Identify Core Domain Objects

Identify the main domain objects used in the workflow.

Examples:

- entities
- DTOs
- Redux state models
- service inputs/outputs

Explain:

- what the object represents
- where it is created
- where it is transformed
- where it is persisted

---

## 5. Identify Key Modules

Determine which modules are responsible for the feature.

Explain:

- what each module does
- how modules depend on each other
- whether responsibilities are clear

Look for signs of architectural problems:

- circular dependencies
- UI depending on persistence
- business logic inside components

---

## 6. Identify Side Effects

Locate operations that affect external systems.

Examples:

- database writes
- filesystem operations
- IPC communication
- network requests

Explain where these operations occur.

---

## 7. Summarize the Workflow

After tracing the code, construct a step-by-step explanation of the workflow.

Describe the process in plain language.

Example structure:

1. User clicks "Create Reservation"
2. React component dispatches `createReservation`
3. Redux thunk calls `ReservationService`
4. Service validates input
5. Repository persists entity
6. Database transaction commits
7. Redux state updates
8. UI re-renders

---

# Output Format

Always structure the output as follows.

---

## Overview

Short explanation of the feature or workflow being investigated.

---

## Entry Point

Where the workflow starts.

List:

- file
- component/function
- responsibility

---

## Architecture Layers

List the layers involved and their role.

---

## Data Flow

Step-by-step trace of how data moves through the system.

Include:

- function names
- modules
- transformations

---

## Domain Objects

Explain the important entities and models involved.

---

## Key Modules

Explain the modules that implement the workflow.

---

## Side Effects

List operations that interact with:

- database
- filesystem
- IPC
- network

---

## Final Summary

Concise explanation of how the workflow works end-to-end.

---

# Rules

Do NOT:

- generate new code
- suggest refactoring unless explicitly asked
- guess functionality without evidence in the code

Always:

- reference concrete modules and functions
- explain relationships between components
- show the full path of data through the system
