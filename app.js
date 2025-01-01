//------------------require express--------------------------
const express=require ("express");
const app=express();
const mongoose=require("mongoose");
const port=8080;
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const Listing=require("./models/listing.js");

const ejsMate=require("ejs-mate");
//----------------------method ovveride-----------------
const methodOverride=require("method-override");
app.use(methodOverride("_method")); 
//----------------------require ejs--------------------
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("db is connected")
}).catch((err)=>{
    console.log(err);
})

app.get("/",(req,res)=>{ //home page123
    res.send("hii i am root")
})


//----------------index route-----------------
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({})
    res.render("listings/index.ejs",{allListings});
      
})

//--------------new route------------------
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})


//--------------show route-------------------
app.get("/listings/:id", async(req,res)=>{
    let {id}=req.params;
   const listing= await Listing.findById(id);
   res.render("listings/show.ejs",{listing});
})

//--------------create route------------------
app.post("/listings",async (req,res)=>{
// let{title,description,image,price,location,country}=req.body;
const newListing=new Listing(req.body.listing);
await newListing.save();
res.redirect("/listings"); 

})


//--------------edit route-------------------
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//-------------Update route--------------------
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing });
    res.redirect(`/listings/${id}`);
})

//---------------delete route--------------------
app.delete("/listings/:id", async(req,res)=>{
    let{id}=req.params;
     let deleteListing=await Listing.findByIdAndDelete(id);
     console.log(deleteListing);
     res.redirect("/listings");

})
// app.get("/testListing",async (req,res)=>{
//      let sampleListing=new Listing({  
//         title:"my-home",
//         description:"by the beach",
//         price:1200,
//         location:"simla",
//         country:"india",
//      });
//     await sampleListing.save();
//      console.log("sample was saved");
//      res.send("succefully testing");
// });



app.listen(port,()=>{
    console.log( `app is listening on ${port}`);
});
