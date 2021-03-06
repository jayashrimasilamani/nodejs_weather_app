const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('../utils/geocode')
const forecast = require('../utils/forecast')

console.log(__dirname)
console.log(path.join(__dirname,'../public'))

//path for express config
const app = express()
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath=path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//set up for handlebar location and views path
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath,()=>{})

//
app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=>{
    res.render('index',{
        title:'Weather',
        name:'Jayashri'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About Me',
        name:'Jayashri'
    })
    
})

//app.com/weather
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location }={}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Jayashri'
    })
})

app.get('/products',(req,res)=>{

    if(!req.query.search){
        return res.send({
            error:'You must provide search item'
        })
    }
    console.log(req.query)
    res.send({
        products:[]
    })
})

app.get('/help/*',(req,res)=>{
    res.render('404', {
        title: '404',
        name: 'Jayashri',
        error:'Help article not found'
    })
})

app.get('*',(req,res)=>{
    res.render('404', {
        title: '404',
        name: 'Jayashri',
        error: 'Page not found'
    })
})
const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log('server is up on port '+port)
})