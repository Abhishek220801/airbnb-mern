const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 8080 
const MONGO_URI = 'mongodb://127.0.0.1:27017/wanderlust';
const Listing = require('./models/listing.js')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

main().then(()=>console.log(`connected to DB`))
.catch((err)=>console.error(err))

async function main(){
    await mongoose.connect(MONGO_URI)
}
app.set('view engine','ejs')
app.set("views",path.join(__dirname,'views'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));

app.get('/',(req,res)=>{
    res.send('Hi, I am root.')
})

//Index Route
app.get('/listings',async (req,res)=>{
    const allListings = await Listing.find({})
    res.render('listings/index.ejs',{allListings})
})

//New Route
app.get('/listings/new', async (req,res)=>{
    res.render('listings/new.ejs')
})
//Show Route
app.get('/listings/:id', async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs",{listing})
})

//Create Route
app.post('/listings',async (req,res)=>{
    // let {title,description,image,price,country,location} = req.body;
    const newListing = new Listing(req.body.listing)
    await newListing.save()
    res.redirect('/listings')
})

//Edit Route
app.get('/listings/:id/edit',async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/edit.ejs",{listing})
})

//Update Route
app.put('/listings/:id', async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing})
    res.redirect(`/listings/${id}`)
})

app.delete('/listings/:id', async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    res.redirect('/listings')
})

// app.get('/testListing',async (req,res)=>{
//     let sampleListing = new Listing({
//         title: 'My New Villa',
//         description: 'By the beach',
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     })
//     await sampleListing.save();
//     console.log('sample was saved')
//     res.send('successful testing')
// })

app.listen(port, ()=> console.log(`App listening on port: ${port}`))