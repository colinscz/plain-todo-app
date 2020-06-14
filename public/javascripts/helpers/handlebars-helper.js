Handlebars.registerHelper('times', function(n, block) {
    let accum = '';
    for (let index = 0; index < n; ++index) {
        accum += block.fn(index);
    }
    return accum;
});

Handlebars.registerHelper('formatDate', (date) => {
    return moment(new Date(date)).format('DD.MM.YYYY HH:mm');
});

