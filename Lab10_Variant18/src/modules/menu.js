(function () {
  const dishes = [
    {id:1,name:'Курица с рисом',category:'Горячее',price:1450,description:'Куриное филе, рис, соус'},
    {id:2,name:'Паста Болоньезе',category:'Горячее',price:1650,description:'Паста, мясной соус, сыр'},
    {id:3,name:'Котлета с пюре',category:'Горячее',price:1350,description:'Домашняя котлета, картофель'},
    {id:4,name:'Борщ',category:'Супы',price:850,description:'Свекольный суп со сметаной'},
    {id:5,name:'Куриный суп',category:'Супы',price:750,description:'Лёгкий суп с лапшой'},
    {id:6,name:'Салат Цезарь',category:'Салаты',price:1250,description:'Курица, салат, сухарики'},
    {id:7,name:'Овощной салат',category:'Салаты',price:650,description:'Свежие сезонные овощи'},
    {id:8,name:'Компот',category:'Напитки',price:300,description:'Домашний ягодный компот'},
    {id:9,name:'Чай',category:'Напитки',price:200,description:'Чёрный или зелёный чай'}
  ];
  window.LunchlineModules = window.LunchlineModules || {};
  window.LunchlineModules.menu = {
    getAll: () => dishes.map(d => ({...d})),
    findById: id => dishes.find(d => d.id === Number(id))
  };
})();