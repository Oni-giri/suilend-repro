import * as fs from 'fs';
import * as path from 'path';

class ObjectDict {
  private filePath: string;
  private data: ObjectTable;

  constructor(filename: string = 'objectDict.json') {
    this.filePath = path.join(process.cwd(), filename);
    this.data = this.loadOrCreate();
  }

  private loadOrCreate(): ObjectTable {
    try {
      const fileContents = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(fileContents);
    } catch {
      const newDict: ObjectTable = { network: {} };
      fs.writeFileSync(this.filePath, JSON.stringify(newDict, null, 2), 'utf8');
      return newDict;
    }
  }

  private save() {
    console.log(this.data)
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
  }

  hasNetwork(network: string): boolean {
    return network in this.data.network;
  }

  hasEntry(
    network: string, 
    packageName: string, 
    packageId: string, 
    typeName: string
  ): boolean {
    try {
      return !!(this.data
        .network[network]
        ?.package[packageName]
        ?.[packageId]
        ?.typeName[typeName]);
    } catch {
      return false;
    }
  }

  addEntry(
    network: string, 
    packageName: string, 
    packageId: string, 
    typeName: string, 
    objectId: string
  ) {
    // Ensure network exists
    if (!this.data.network[network]) {
      this.data.network[network] = { package: {} };
    }
    
    // Ensure package name exists
    if (!this.data.network[network].package[packageName]) {
      this.data.network[network].package[packageName] = {};
    }
    
    // Add or update package ID entry
    if (!this.data.network[network].package[packageName][packageId]) {
      this.data.network[network].package[packageName][packageId] = { typeName: {} };
    }
    
    // Add type name with object ID
    this.data.network[network].package[packageName][packageId].typeName[typeName] = objectId;
    
    this.save();
  }

  getEntry(
    network: string, 
    packageName: string, 
    packageId: string, 
    typeName: string
  ) {
    return this.data
      .network[network]
      .package[packageName][packageId]
      .typeName[typeName];
  }
}

interface ObjectTable {
  network: Record<string, {
    package: Record<string, Record<string, {
      typeName: Record<string, string>;
    }>>;
  }>;
}

export default ObjectDict;