let score = 0;
let current_time = 0;
let deadline_time = 300;

function start_time() {
	const { SCORES } = get_game_elements();
	const i_score = SCORES.querySelector("[i-score]");
	const i_time = SCORES.querySelector("[i-time]");
	const i_deadline = SCORES.querySelector("[i-deadline]");

	i_score.innerText = "Score: " + score;
	i_time.innerText = "Current Time: " + current_time + " minutes";
	i_deadline.innerText = "Late Time: " + deadline_time + " minutes";

	setInterval(() => {
		current_time += 1;
		i_time.innerText = "Current Time: " + current_time + " minutes";
	}, 1000);
}

function init() {
	init_landing_listeners();
}

function init_play() {
	start_time();
	add_student_periodically();
	update_student_info_periodically();
}

function init_landing_listeners() {
	const { PARENT_ACTIONS, LANDING_MAIN } = get_landing_elements();
	const { GAME_MAIN } = get_game_elements();

	PARENT_ACTIONS.addEventListener("click", ({ target }) => {
		// Start
		if (target.getAttribute("b-start") !== null) {
			LANDING_MAIN.classList.add("start_play");
			GAME_MAIN.classList.remove("no-display");
			init_play();
		}

		// Scores
		if (target.getAttribute("b-scores") !== null) {
			console.log(2);
		}

		// Reset
		if (target.getAttribute("b-reset") !== null) {
			console.log(3);
		}
	});
}

function get_landing_elements() {
	return {
		LANDING_MAIN: document.querySelector("[x-opening]"),
		PARENT_ACTIONS: document.querySelector("[x-actions]"),
	};
}

function update_student_info_periodically() {
	const { GAME_GRID, STUDENT_INFO } = get_game_elements();

	const accept = STUDENT_INFO.querySelector("[accept]");
	const reject = STUDENT_INFO.querySelector("[reject]");

	const s_name = STUDENT_INFO.querySelector("[s-name]");
	const s_age = STUDENT_INFO.querySelector("[s-age]");
	const s_pwd = STUDENT_INFO.querySelector("[s-pwd]");
	const s_clothe = STUDENT_INFO.querySelector("[s-clothe]");
	const s_accessories = STUDENT_INFO.querySelector("[s-accessories]");
	const s_arrival = STUDENT_INFO.querySelector("[s-arrival]");
	const s_id = STUDENT_INFO.querySelector("[s-id]");
	const s_image = STUDENT_INFO.querySelector("img");

	let currentStudent = null;

	function shiftStudentsLeft() {
		const waiting_students = GAME_GRID.querySelectorAll("[student]");
		waiting_students.forEach((student) => {
			student.style.gridColumnStart = parseInt(student.style.gridColumnStart) + 1;
		});
	}

	function accept_student() {
		if (!currentStudent) return;
		STUDENT_INFO.dataset.current_id = currentStudent.dataset.id;
		currentStudent.remove();
		shiftStudentsLeft();
		currentStudent = null;
	}

	function reject_student() {
		if (!currentStudent) return;
		STUDENT_INFO.dataset.current_id = currentStudent.dataset.id;
		currentStudent.remove();
		shiftStudentsLeft();
		currentStudent = null;
	}

	accept.addEventListener("click", accept_student);
	reject.addEventListener("click", reject_student);

	setInterval(() => {
		const game_grid_children = GAME_GRID.children;
		const students = [];
		for (let i = 0; i < game_grid_children.length; i++) {
			if (game_grid_children[i].getAttribute("student") !== null) {
				students.push(game_grid_children[i]);
			}
		}

		if (students.length === 0) {
			STUDENT_INFO.classList.add("no-display");
			currentStudent = null;
		} else {
			STUDENT_INFO.classList.remove("no-display");
			const student = students[0];

			// Skip update if same student
			if (STUDENT_INFO.dataset.current_id === student.dataset.id) return;

			STUDENT_INFO.dataset.current_id = student.dataset.id;
			currentStudent = student;

			const { name, age, clothe, accessory, is_wearing_id, is_pwd, picture, arrival_time } = JSON.parse(student.dataset.info);

			s_name.innerText = "Name: " + name;
			s_age.innerText = "Age: " + age;
			s_pwd.innerText = "Is PWD?: " + (is_pwd ? "True" : "False");
			s_clothe.innerText = "Wearing: " + clothe;
			s_accessories.innerText = "Accessory: " + accessory;
			s_arrival.innerText = "Arrival Time: " + arrival_time + " minutes";
			s_id.innerText = "Has ID?: " + (is_wearing_id ? "True" : "False");
			s_image.src = picture;
		}
	}, 100);
}

function add_student_periodically() {
	const { GAME_GRID } = get_game_elements();

	setInterval(() => {
		// prettier-ignore
		const names = [
            "Jose Rizal",
            "Andres Bonifacio",
            "Emilio Aguinaldo",
            "Melchora Aquino",
            "Gabriela Silang",
            "Lapu-Lapu",
            "Apolinario Mabini",
            "Manuel Quezon",
            "Sergio Osmeña",
            "Corazon Aquino"
        ];
		// prettier-ignore
		const accesories = [
            "wristwatch", 
            "eyeglasses", 
            "hair tie",
            "makeup",
            "gun",
            "explosives",
            "cap",
            "knife",
        ];
		// prettier-ignore
		const clothing = [
            "school uniform",
            "t-shirt",
            "crop tops",
            "ripped jeans",
            "short shorts",
            "sleeveless shirts",            
        ]

		const name = names[Math.floor(Math.random() * names.length)];
		const age = Math.floor(Math.random() * (30 - 16 + 1) + 16);
		const clothe = clothing[Math.floor(Math.random() * clothing.length)];
		const accessory = accesories[Math.floor(Math.random() * accesories.length)];
		const is_wearing_id = Math.floor(Math.random() * 2); // Returns 0 or 1
		const is_pwd = Math.floor(Math.random() * 2);
		const picture = `./assets/${Math.floor(Math.random() * 10)}.png`;
		const arrival_time = current_time;

		const student_info = JSON.stringify({ name, age, clothe, accessory, is_wearing_id, is_pwd, picture, arrival_time });

		const waiting_students = GAME_GRID.querySelectorAll("[student]");
		const waiting_students_count = waiting_students.length;
		if (11 - waiting_students_count <= 0) return;

		const id = Math.max(...Array.from(waiting_students).map((student) => student.dataset?.id ?? 0), 0) + 1;
		const min_column_start = Math.min(...Array.from(waiting_students).map((student) => parseInt(student.style.gridColumnStart)), 12) - 1;

		const new_student = create_element("span", { dataset: { id: id, info: student_info } });

		new_student.setAttribute("style", `grid-column-start: ${min_column_start};`);
		new_student.setAttribute("student", "");

		GAME_GRID.appendChild(new_student);
	}, 500);
}

function create_element(name, attr) {
	const element = document.createElement(name);

	for (let key in attr) {
		if (key === "dataset" && typeof attr[key] === "object") {
			for (let data in attr.dataset) {
				element.dataset[data] = attr.dataset[data];
			}
		} else if (key in element) {
			element[key] = attr[key];
		} else {
			element.setAttribute(key, attr[key]);
		}
	}

	return element;
}

function get_game_elements() {
	return {
		GAME_MAIN: document.querySelector("[x-game]"),
		GAME_GRID: document.querySelector("[g-grid]"),
		STUDENT_INFO: document.querySelector("[g-info]"),
		SCORES: document.querySelector("[g-scores]"),
	};
}

init();
