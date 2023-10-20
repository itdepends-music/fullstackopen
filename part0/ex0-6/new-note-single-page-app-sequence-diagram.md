```mermaid

sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa, {"content":"test","date":"2023-10-20T03:28:39.640Z"}
    activate server
    Note right of browser: The browser displays the newly created note
    server-->>browser: 201 Created
    deactivate server

```
