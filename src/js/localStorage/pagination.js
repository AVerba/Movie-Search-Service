const pagination1 = new tui.Pagination('pagination1', {
    totalItems: 500,
    itemsPerPage: 10,
    visiblePages: 5
});

const pagination2 = new tui.Pagination(document.getElementById('pagination2'), {
    totalItems: 500,
    itemsPerPage: 10,
    visiblePages: 5,
    centerAlign: true
});