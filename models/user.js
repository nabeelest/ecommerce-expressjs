const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const p = path.join(rootDir,'data','users.json');

const getUsersFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
}

module.exports = class User {
    constructor(name,email,password,country) {
        this.username = name;
        this.email = email;
        this.password = password;
        this.country = country;
    }

    save() {
        getUsersFromFile(users => {
          users.push(this);
          fs.writeFile(p, JSON.stringify(users), err => {
            console.log(err);
          });
        });
    }

    static fetchAll(cb) {
        getUsersFromFile(cb);
    }
}
