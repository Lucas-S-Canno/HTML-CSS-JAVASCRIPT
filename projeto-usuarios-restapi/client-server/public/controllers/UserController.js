/*jshint esversion: 6 */
class UserController {
  constructor(formIdCreate, formIdUpdate, tableId) {
    this.formEl = document.getElementById(formIdCreate);
    this.formUpdateEl = document.getElementById(formIdUpdate);
    this.tableEl = document.getElementById(tableId);
    this.onSubmit();
    this.onEdit();
    this.selectAll();
  }

  onEdit() {
    document
      .querySelector("#box-user-update .btn-cancel")
      .addEventListener("click", (e) => {
        this.showPanelCreate();
      });
    this.formUpdateEl.addEventListener("submit", (e) => {
      event.preventDefault();
      let btn = this.formUpdateEl.querySelector("[type=submit]");
      btn.disabled = true;
      let values = this.getValues(this.formUpdateEl);
      let index = this.formUpdateEl.dataset.trIndex;
      let tr = this.tableEl.rows[index];
      let userOld = JSON.parse(tr.dataset.user);
      let result = Object.assign({}, userOld, values);

      this.getPhoto(this.formUpdateEl).then(
        (content) => {
          if (!values.photo) {
            result._photo = userOld._photo;
          } else {
            result._photo = content;
          }
          let user = new User();
          user.loadFromJSON(result);
          user.save();
          this.getTr(user, tr);
          this.updateCount();

          this.formUpdateEl.reset();
          btn.disabled = false;
          this.showPanelCreate();
        },
        (e) => {
          console.error(e);
        }
      );
    });
  }

  onSubmit() {
    this.formEl.addEventListener("submit", (event) => {
      //criar evento com o botão submit
      event.preventDefault();
      let btn = this.formEl.querySelector("[type=submit]");
      btn.disabled = true;
      let values = this.getValues(this.formEl);
      if (!values) return false;
      this.getPhoto(this.formEl).then(
        (content) => {
          //uso de arrow function para manter o "this" com o mesmo valor
          values.photo = content;
          values.save();
          this.addLine(values);
          this.formEl.reset();
          btn.disabled = false;
        },
        (e) => {
          console.error(e);
        }
      );
    });
  }

  getPhoto(formEl) {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      let elements = [...formEl.elements].filter((item) => {
        if (item.name === "photo") {
          return item;
        }
      });
      let file = elements[0].files[0];

      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (e) => {
        reject(e);
      };

      if (file) {
        fileReader.readAsDataURL(file);
      } else {
        resolve("dist/img/boxed-bg.jpg");
      }
    });
  }

  getValues(formEl) {
    let btn = this.formEl.querySelector("[type=submit]");
    let user = {};
    let isValid = true;

    [...formEl.elements].forEach(function (field, index) {
      if (
        ["name", "email", "password"].indexOf(field.name) > -1 &&
        !field.value
      ) {
        field.parentElement.classList.add("has-error");
        isValid = false;
      }
      // if para pegar somente o campo de genero marcado "fields.forEach(function (field, index) {"
      if (field.name == "gender") {
        if (field.checked) {
          //poderia ser (field.checked === true, pois verifica se é verdadeira a condição)
          user[field.name] = field.value;
        }
      } else if (field.name == "admin") {
        user[field.name] = field.checked;
      } else {
        //caso não seja o campo de genero, ele volta o valor dele
        user[field.name] = field.value;
      }
      btn.disabled = false;
    });

    if (!isValid) {
      let btn = this.formEl.querySelector("[type=submit]");
      alert(
        `Preencha corretamente os dados do formulário.\nDados Obrigatórios: Nome, Email e Senha`
      );
      btn.disabled = false;
      return false;
    }

    return new User(
      user.name,
      user.gender,
      user.birth,
      user.country,
      user.email,
      user.password,
      user.photo,
      user.admin
    );
  }

  selectAll() {
    let users = User.getUsersStorage();
    users.forEach((dataUser) => {
      let user = new User();
      user.loadFromJSON(dataUser);
      this.addLine(user);
    });
  }

  // insert(data){ //metodo não usado mais, pois foi acrescentado o o metodo save no models\User.js
  //   let users = this.getUsersStorage();
  //   users.push(data);
  //   // sessionStorage.setItem("users", JSON.stringify(users)); //para session storage é só alterar todos os localStorage para sessionStorage e ja troca o local de armazenamento
  //   localStorage.setItem("users", JSON.stringify(users));
  // }

  addLine(dataUser) {
    // var tr = document.createElement("tr");
    //a sintaxe do innerHTML está correta, porem o não está atualizada no package do atom, pode ser que a proxima vez não apareça o erro

    let tr = this.getTr(dataUser);

    //<td>${(dataUser.admin) ? 'Sim' : 'não'}</td> --------> if ternario, em uma unica linha, ?(se) dataUser.admin for true escreva "Sim" :(se não) escreva "Não"

    this.tableEl.appendChild(tr);
    //tambem funciona
    // this.tableEl.innerHTML += `<tr>
    //       <td><img src=${dataUser.photo} alt="User Image" class="img-circle img-sm"></td>
    //       <td>${dataUser.name}</td>
    //       <td>${dataUser.email}</td>
    //       <td>${dataUser.admin}</td>
    //       <td>${dataUser.birth}</td>
    //       <td>
    //         <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
    //         <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
    //       </td>
    //       </tr>`;
    // usa a crase (``) permite a inserção do html da maneira em que foi escrita com quebras de linha e o uso de variaveis como nomes escrevendo ${var.valor}
    // document.getElementById(tableId).appendChild(tr);
    this.updateCount(tr);
  }

  getTr(dataUser, tr = null) {
    if (tr === null) tr = document.createElement("tr");
    tr.dataset.user = JSON.stringify(dataUser);
    tr.innerHTML = `
          <td><img src=${
            dataUser.photo
          } alt="User Image" class="img-circle img-sm"></td>
          <td>${dataUser.name}</td>
          <td>${dataUser.email}</td>
          <td>${dataUser.admin ? "Sim" : "não"}</td>
          <td>${Utils.dateFormat(dataUser.register)}</td>
          <td>
            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
          </td>
          `;
    this.addEventsTr(tr);
    return tr;
  }

  addEventsTr(tr) {
    tr.querySelector(".btn-delete").addEventListener("click", (e) => {
      if (confirm("Deseja realmente excluir o usuário?")) {
        let user = new User();
        user.loadFromJSON(JSON.parse(tr.dataset.user));
        user.delete();
        tr.remove();
        this.updateCount();
      }
    });

    tr.querySelector(".btn-edit").addEventListener("click", (e) => {
      let json = JSON.parse(tr.dataset.user);
      // let form = document.querySelector("#form-user-update");
      this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
      for (let name in json) {
        let field = this.formUpdateEl.querySelector(
          "[name=" + name.replace("_", "") + "]"
        );
        if (field) {
          switch (field.type) {
            case "file":
              continue;
            // break;

            case "radio":
              field = this.formUpdateEl.querySelector(
                "[name=" + name.replace("_", "") + "][value=" + json[name] + "]"
              );
              field.checked = true;
              break;

            case "checkbox":
              field.checked = json[name];
              break;

            default:
              field.value = json[name];
          }
        }
      }
      this.formUpdateEl.querySelector(".photo").src = json._photo;
      this.showPanelUpdate();
    });
  }

  showPanelCreate() {
    document.querySelector("#box-user-create").style.display = "block";
    document.querySelector("#box-user-update").style.display = "none";
  }

  showPanelUpdate() {
    document.querySelector("#box-user-create").style.display = "none";
    document.querySelector("#box-user-update").style.display = "block";
  }

  updateCount(tr) {
    let numberUsers = 0;
    let numberAdmin = 0;
    // console.log(tr.dataset.user);
    [...this.tableEl.children].forEach((tr) => {
      numberUsers++;
      let user = JSON.parse(tr.dataset.user);
      // console.log(user);
      if (user._admin) numberAdmin++;
    });
    document.querySelector("#number-users").innerHTML = numberUsers;
    document.querySelector("#number-users-admin").innerHTML = numberAdmin;
  }
}
