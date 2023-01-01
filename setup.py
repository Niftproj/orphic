import sys
import os
import subprocess

script_version = 0.1


orphic_available_packages = (
    {
        "name": 'Orphic Core',
        "path": 'packages/orphic.core',
        "type": 'core',
        "cmd": "o-core",
        "dev": ["npm install"],
        "build": ["npm install", "npm run build"]
    },
    {
        "name": 'OrphicUI React',
        "path": 'packages/orphic.ui.react',
        "type": 'ui',
        "cmd": "o-ui-react"
    },
    {
        "name": 'OrphicUI VanillaJS',
        "path": 'packages/orphic.ui.js',
        "type": 'ui',
        "cmd": "o-ui-js"
    }
)

def get_given_packages(args, start_from):
    values = []
    for x in range(len(args)):
        if x > start_from:
            values.append(args[x])
    return values

def get_from_available_packages(required):
    packages_ = []
    completed = []
    for w in required:
        for x in orphic_available_packages:
            if x['cmd'] == w and w not in completed:
                packages_.append(x)
                completed.append(w)
    return packages_

def greetings():
    print(":::::::::::orphic::::::::::::")
    print("- script version: ", script_version)

def printHelp():
    greetings()
    print("- commands:")
    print("     - help : help with commands.")
    print("     - dev   <packages list seprated with space> : setup dev env for given packages.")
    print("     - build <packages list seprated with space> : builds the given packages.")
    print("- available packages:")
    for x in orphic_available_packages:
        print("     - {}".format(x['name']))
    

def run_cmd(packages, env):
    for x in packages:
        path = "{}/{}".format(os.path.dirname(os.path.realpath(__file__)), x['path'])
        commands = []
        if env in x:
            commands = x[env]
        commands = " && ".join(commands)
        if len(commands) > 0:
            os.chdir(path)
            cwd = os.getcwd()
            print(">> ", commands)
            p = subprocess.Popen([commands, cwd], shell=True)

def setup_dev(packages):
    greetings()
    needed_packages = get_from_available_packages(packages)
    print("- requested packages:")
    for x in needed_packages:
        print("     - {}".format(x['name']))
    run_cmd(needed_packages, 'dev')


def setup_build(packages):
    greetings()
    print("Build.")

def execute_instruction(instruction, packages):
    if instruction == 'help':
        printHelp()
    elif instruction == 'dev':
        setup_dev(packages)
    elif instruction == 'build':
        setup_build(packages)


def main():
    # script (self)
    script = sys.argv[0]
    
    command = sys.argv[1]
    orphic_given_packages = get_given_packages(sys.argv, 1)

    execute_instruction(command, orphic_given_packages)



if __name__ == '__main__':
    main()