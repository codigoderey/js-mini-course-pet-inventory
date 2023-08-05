class Pet {
	constructor(id, name, type, age) {
		this.id = id;
		this.name = name;
		this.type = type;
		this.age = age;
	}
}

class Storage {
	static getPets() {
		let pets;
		if (localStorage.getItem("pets") === null) {
			pets = [];
		} else {
			pets = JSON.parse(localStorage.getItem("pets"));
		}
		return pets;
	}

	static addPet(pet) {
		const pets = Storage.getPets();
		pets.push(pet);
		localStorage.setItem("pets", JSON.stringify(pets));
	}

	static removePet(id) {
		const pets = Storage.getPets();
		pets.forEach(function (pet, index) {
			if (pet.id === id) {
				pets.splice(index, 1);
			}
		});
		localStorage.setItem("pets", JSON.stringify(pets));
	}

	static updatePets(pets) {
		localStorage.setItem("pets", JSON.stringify(pets));
	}
}

class UI {
	// add pet to list
	addPetToList(pet) {
		const list = document.getElementById("pet-list");
		// create tr element
		const row = document.createElement("tr");
		// insert cols
		row.innerHTML = `
      <td>${pet.id}</td>
      <td>${pet.name}</td>
      <td>${pet.type}</td>
      <td>${pet.age}</td>
      <td>
        <a href="/edit.html?id=${pet.id}" class="btn btn-primary btn-sm"
          ><i class="bi bi-pencil-square"></i
        ></a>
        <button class="btn btn-danger btn-sm">
          <i class="bi bi-trash delete"></i>
        </button>
      </td>
    `;
		list.appendChild(row);
	}

	// delete pet
	deletePet(target) {
		// from DOM
		if (!target.classList.contains("delete")) return;
		target.parentElement.parentElement.parentElement.remove();
	}

	// show alert
	showAlert(message, className) {
		// create div
		const div = document.createElement("div");
		// add classes
		div.className = `mt-3 alert ${className}`;
		// add text
		div.appendChild(document.createTextNode(message));
		// get parent
		const container = document.querySelector("#message-container");
		// get form
		const form = document.querySelector("#pet-form");
		// insert alert
		container.insertBefore(div, form);

		// timeout after 3 sec
		setTimeout(function () {
			document.querySelector(".alert").remove();
		}, 3000);
	}

	// clear fields after submit
	clearFields() {
		document.getElementById("name").value = "";
		document.getElementById("type").value = "";
		document.getElementById("age").value = "";
	}
}

/* EVENT LISTENERS */

// add pet
document.getElementById("pet-submit").addEventListener("submit", function (e) {
	e.preventDefault();

	// get form values
	const name = document.getElementById("name").value,
		type = document.getElementById("type").value,
		age = document.getElementById("age").value;

	// instantiate UI
	const ui = new UI();

	// validate
	if (name === "" || type === "" || age === "") {
		// error alert
		ui.showAlert("All fields required.", "alert-warning");
		return;
	}

	// get random id
	const id = randomId(name, type, age).toLowerCase();

	// instantiate pet
	const pet = new Pet(id, name, type, age);

	// add to local storage
	Storage.addPet(pet);

	// add pet to list
	ui.addPetToList(pet);

	// clear fields
	ui.clearFields();

	// show alert
	ui.showAlert("Pet Added!", "alert-success");
});

// delete pet
document.getElementById("pet-list").addEventListener("click", function (e) {
	// instantiate UI
	const ui = new UI();

	if (!e.target.classList.contains("delete")) return;

	// delete pet from local storage
	if (
		!e.target.parentElement.parentElement.previousElementSibling
			.previousElementSibling.previousElementSibling.previousElementSibling
			.textContent
	)
		return;

	Storage.removePet(
		e.target.parentElement.parentElement.previousElementSibling
			.previousElementSibling.previousElementSibling.previousElementSibling
			.textContent
	);

	// delete pet from dom
	ui.deletePet(e.target);

	// show message
	ui.showAlert("Pet Removed!", "alert-success");
});

// update a pet from local storage
document.getElementById("pet-update").addEventListener("submit", function (e) {
	e.preventDefault();

	// get form values
	// get id from url
	const id = window.location.search.split("=")[1],
		name = document.getElementById("name").value,
		type = document.getElementById("type").value,
		age = document.getElementById("age").value;

	const pets = Storage.getPets();
	pets.forEach((pet) => {
		if (pet.id === id) {
			pet.name = name;
			pet.type = type;
			pet.age = age;
		}
	});
	Storage.updatePets(pets);

	// show alert
	const ui = new UI();
	ui.showAlert("Pet Updated!", "alert-success");
});

// get all pets from local storage and display
window.addEventListener("DOMContentLoaded", () => {
	// display all pets
	const pets = Storage.getPets();
	if (pets.length === 0) {
		document.getElementById("pet-list").innerHTML =
			"<tr><td colspan='5' class='text-center'>No pets found</td></tr>";
	} else {
		pets.forEach(function (pet) {
			const ui = new UI();
			ui.addPetToList(pet);
		});
	}

	/** GET SINGLE PET FROM LS */
	// get id from url
	const urlParams = new URLSearchParams(window.location.search);
	const id = urlParams.get("id");
	getPet(id);
});

// get a random number from 1 2000 to use as id
const randomId = (petName, type, age) =>
	Math.floor(Math.random() * 2000) + 1 + "-" + petName + "-" + type + "-" + age;

function getPet(id) {
	const pets = Storage.getPets();
	pets.forEach(function (pet) {
		if (pet.id === id) {
			document.getElementById("name").value = pet.name;
			document.getElementById("type").value = pet.type;
			document.getElementById("age").value = pet.age;
		}
	});
}
