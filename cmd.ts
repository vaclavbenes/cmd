type stdout = "inherit" | "piped" | "null" | number;
type stderr = "inherit" | "piped" | "null" | number;
type stdin = "inherit" | "piped" | "null" | number;

const decode = (val: Uint8Array) => new TextDecoder().decode(val);

function filterEmpty(values: string[]): string[]{
  return values.filter((val) => val.length !== 0);
}

function validate_quotes(values: string[]): string[] {
  let quoted_string = ""
  let ignored_quote_list: string[] = []
  let flag = false;

  for (const value of values){
    if (value.startsWith('"') || value.endsWith('"')){
      flag=true
    }

    if (flag) {
      quoted_string +=  " " + value.replace('"','')
    } else {
      ignored_quote_list.push(value)
    }
  }

  ignored_quote_list.push(quoted_string.trim())

  return ignored_quote_list
}

/** Write simple shell command like a string
 *
 *      cmd("ls .")
 *
 * Write like a script line by line with await
 *
 *      const { code } = await cmd("ls .");
 *      console.log(code);
 *
 *      const { code, stdout, stderr } = await cmd("ls .", "piped", "piped");
 *      console.log(code);
 *
 **/
export async function cmd(value: string, stdout?: stdout, stderr?: stdout, stdin?: stdin) {
  const split = value.split(" ")
  const quotes =  filterEmpty(validate_quotes(split))

  const p = Deno.run(
    { "cmd": quotes, stdout: stdout, stderr: stderr, stdin: stdin},
  );

  const { code } = await p.status();

  if (stdout === "piped" && stderr === "piped") {
    const out = await p.output();
    const err = await p.stderrOutput();
    return { code, stdout: decode(out), stderr: decode(err) };
  }

  return { code };
}

