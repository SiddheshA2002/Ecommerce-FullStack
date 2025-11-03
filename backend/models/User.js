class User {
  constructor(id, name, email, password, role, createdAt) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
  }

  isAdmin() {
    return this.role === 'admin';
  }
}

module.exports = User;