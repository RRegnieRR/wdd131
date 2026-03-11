const input = document.querySelector('#favchap');
const button = document.querySelector('button');
const list = document.querySelector('#list');

button.addEventListener('click', function () {
	const chapter = input.value.trim();
	if (chapter !== '') {
		const li = document.createElement('li');
		const deleteButton = document.createElement('button');

		li.textContent = chapter;
		deleteButton.textContent = '❌';
		deleteButton.classList.add('delete');
		deleteButton.setAttribute('aria-label', `Remove ${chapter}`);

		li.append(deleteButton);
		list.append(li);

		deleteButton.addEventListener('click', function () {
			list.removeChild(li);
			input.focus();
		});
		input.value = '';
	}
	input.focus();
});
