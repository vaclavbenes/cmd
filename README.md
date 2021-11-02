# Deno cmd 🦖

Write simple shell command like a string

> Bash

```bash
ls .
```

> Deno cmd

```typescript
cmd("ls .")
 ```

Load script
```typescript
import { cmd } from "https://raw.githubusercontent.com/vaclavbenes/cmd/master/mod.ts";

```

 Write like a script line by line with await

```typescript
const { code } = await cmd("ls .");
console.log(code)
const { code, stdout, stderr } = await cmd("ls .", "piped""piped");
console.log(code);
 ```
