export const showHelp = () => {
  console.log('Usage: truffle-barn [options]')
  console.log('Options:')
  console.log('  -r, --repository <owner/name> \tScan a single repository')
  console.log(
    '  -o, --organization <name> \t\tScan all repositories in an organization'
  )
  console.log('  -h, --help\t\t\t\tShow help')
}
