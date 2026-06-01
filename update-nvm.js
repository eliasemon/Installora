const fs = require('fs');

const winNvm = {
  id: "CoreyButler.NVMforWindows",
  name: "NVM for Windows",
  description: "Node.js version manager for Windows",
  category: "Developer",
  tags: ["nodejs", "nvm", "version-manager", "tool"],
  icon: "terminal",
  popular: true,
  size: "~5 MB",
  logoUrl: "/images/logos/openjs-nodejs-lts.png"
};

const macNvm = {
  id: "formula:nvm",
  name: "NVM",
  description: "Node Version Manager to manage multiple active node.js versions",
  category: "Developer",
  tags: ["nodejs", "nvm", "version-manager", "tool"],
  icon: "terminal",
  popular: true,
  size: "~1 MB",
  logoUrl: "/images/logos/openjs-nodejs-lts.png"
};

const linuxNvm = {
  id: "sh:nvm",
  name: "NVM",
  description: "Node Version Manager to manage multiple active node.js versions",
  category: "Developer",
  tags: ["nodejs", "nvm", "version-manager", "tool"],
  icon: "terminal",
  popular: true,
  size: "~1 MB",
  logoUrl: "/images/logos/openjs-nodejs-lts.png"
};

function addPackage(file, pkg) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  // check if already exists
  if (!data.find(p => p.id === pkg.id)) {
    // Insert after NodeJS if found, else at end
    const nodeIndex = data.findIndex(p => p.id.toLowerCase().includes('nodejs') || p.name.toLowerCase().includes('node.js'));
    if (nodeIndex !== -1) {
      data.splice(nodeIndex + 1, 0, pkg);
    } else {
      data.push(pkg);
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
    console.log(`Added ${pkg.id} to ${file}`);
  } else {
    console.log(`${pkg.id} already exists in ${file}`);
  }
}

addPackage('data/packages.json', winNvm);
addPackage('data/mac-packages.json', macNvm);
addPackage('data/linux-packages.json', linuxNvm);

