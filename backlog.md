### User Stories, Functionality documentation

- [x] Get available commands with the `help` command. Information about a specific command can be retrieved with `help <command name>`

- [x] When attempting to input an inexisting command, the user should be let known of such, with a "Unknown command: <command>" message

- [x] The user should be able to create files, one or multiple at once with the following syntax: `touch file.ext` or `touch {fileOne.ext,fileTwo.ext,fileThree.ext}`

- [x] The user should be able to create folders, one or multiple at once with the following syntax: `mkdir <folder name>` or `mkdir {folderOne,folderTwo,folderThree}`

- [x] The user should be able to list contents of the current directory with `ls`. Directories are shown with a trailing `/`.

- [x] The user should be able to delete files, one or multiple at once: `rm file.ext`, `rm file1.ext file2.ext`, `rm {fileOne.ext,fileTwo.ext}`

- [x] The user should be able to delete folders recursively: `rm -r <folder>`. Force flag `-f` suppresses not-found errors. Combined: `rm -rf`.

- [x] The user should be able to navigate directories: `cd <folder>`, `cd path/to/folder`, `cd ..`, `cd ../..`, `cd ~` to return to root.

- [x] The user should be able to print command history with `history`

- [ ] Terminal output should support ANSI color codes so commands (injected or built-in) can emit colored text

- [ ] Tab completion for commands and file paths

### grep — extended flags (nice to have)

- [ ] `grep -l` — print only filenames of matching files, not lines
- [ ] `grep -c` — print count of matching lines per file
- [ ] `grep -A <n>` — print n lines of context after match
- [ ] `grep -B <n>` — print n lines of context before match
- [ ] `grep -C <n>` — print n lines before and after match
- [ ] `grep -w` — match whole words only
- [ ] `grep -x` — match whole lines only
- [ ] `grep -m <n>` — stop after n matches
- [ ] `grep -o` — print only the matching part of line
- [ ] `grep --include=<glob>` — only search files matching glob (e.g. `*.ts`)
- [ ] `grep --exclude=<glob>` — skip files matching glob
- [ ] `grep -e <pattern>` — multiple patterns (`grep -e foo -e bar file`)
- [ ] `grep -F` — treat pattern as fixed string, not regex
