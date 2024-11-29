document.getElementById('food-category').addEventListener('change', (e) => {
    const category = e.target.value;
    alert(`Filtering by: ${category}`);
});
