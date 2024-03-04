const express = require('express');
const ExpressError = require('./expressError');
const items = require('./fakeDb');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log(req);
    return res.send(`<h1>Home Page</h1>`);
});

app.get('/items', (req, res) => {
    //list of shopping items
    return res.json({items: items});
});

app.post('/items', (req, res) => {
    //accept json and add to shopping list
    try{
        const newItem = req.body;
        if (!newItem) throw new ExpressError('JSON not valid', 404);
        items.push(newItem);
        return res.status(201).json({ added: newItem });
    }catch(e){
        return next(e);
    }
});

app.get('/items/:name', (req, res) => {
    //display a single item's name and/or price
    try{
        const item = items.find(i => i.name === req.params.name);
        if (!item) throw new ExpressError('Item not found', 404);
        
        return res.status(200).json({item: item});
    }catch(e){
        return next(e);
    }
});

app.patch('/items/:name', (req, res) => {
    //modify a single item's name and/or price
    try{
        const itemIndex = items.findIndex(i => i.name === req.params.name);
        if (itemIndex === -1) throw new ExpressError('Item not found', 404);
        const updatedItem = { ...items[itemIndex], ...req.body };
        items[itemIndex] = updatedItem;
        res.json({ updated: updatedItem });
    }catch(e){
        return next(e);
    }
});

app.delete('/items/:name', (req, res) => {
    //delete a specific item from the array
    try{
        const itemIndex = items.findIndex(i => i.name === req.params.name);
        if (itemIndex === -1) throw new ExpressError('Item not found', 404);
        items.splice(itemIndex, 1);
        return res.json({ message: 'Deleted' });
    }catch(e){
        return next(e);
    } 
});

app.use(function(err, req, res, next){
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError);
});

app.use(function(err, req, res, next) {
    let status = err.status || 500;
    let message = err.message;
    return res.status(status).json({
        error: {message, status}
    });
});

module.exports = app;