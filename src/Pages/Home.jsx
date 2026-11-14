import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from 'react-router';
import RecipeCard from '../Components/RecipeCard';



function Home() {

    const [recipes, setrecipes] = useState([])
    const [total, settotal] = useState(0)
     const [loading,setloading]= useState(true)
       const [errormessage,seterrormessage]= useState("")
    const [searchQuery, setsearchQuery] = useState("")

    async function fetchRecipes(skipCount, query) {
        setloading(true);
        try {
            let url = `https://dummyjson.com/recipes?limit=6&skip=${skipCount}`
            if (query) {
                url = `https://dummyjson.com/recipes/search?limit=6&skip=${skipCount}&q=${query}`
            }
            const { data } = await axios.get(url);
            setrecipes((prev) => skipCount===0?data.recipes:[...prev, ...data.recipes]);
            settotal(data.total);
         } catch (error) {
            seterrormessage("Could not load recipe details. Please try again")
        }
       setloading(false)
    }

    useEffect(() => {
        fetchRecipes(0);
    }, []);

    function handleSearch(e) {
        console.log(e.target);
        e.preventDefault();
        const form = new FormData(e.target);
        let query = form.get("query").trim();
        setsearchQuery(query);
       
            fetchRecipes(0,query)
        
    }

     if(loading){
            return <p className='text-center py-6 text-muted'>Loading...</p>
        }
        if(errormessage){
            return (
                <main className='max-w-6xl mx-auto px-4 py-8'>
                    <Link to="/" className='text-accent hover:underline linline-flex items-center gap-1 mb-4'>
                    <svg className='w-4 h-4 stroke-current fill-none'
                    strokeWidth="2"
                    viewBox='0 0 24 24'
                    >
                        <line x1="19" y1="12" x2={5} y2={12} />
                        <polyline points='12 18 5 12 5'/>
                        <polyline points='12 5 5 12 5'/>
    
                    </svg>
                    Back to Home
                    </Link>
                    <p className='text-accent'>{errormessage || "Recipe not found"}</p>
    
                </main>
            )
        }


    return (
        <main className="max-w-6xl mx-auto px-4 py-8">
            { }
            { }
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-8">
                <input
                    type="text"
                    name='query'
                    placeholder="Search recipes..."
                    className="flex-1 border border-border rounded px-3 py-2 bg-card text-text outline-none focus:border-accent"
                />
                <button type="submit" className="bg-accent hover:bg-accent-hover text-white rounded px-4 py-2 font-medium">
                    Search
                </button>
            </form>
            {recipes.length===0 && <p className='text-center py-6 text-muted'>{`No rexipe found for ${searchQuery}`}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>

            {/* {
                recipes.map((r)=><li>{r.name}</li>)
            } */}
            {recipes.length < total && <div className="text-center mt-8">
                <button
                    type="button"
                    onClick={() => fetchRecipes(recipes.length,searchQuery)}
                    className="bg-accent hover:bg-accent-hover text-white rounded px-6 py-2 font-medium"
                >
                    Load More
                </button>
            </div>}
        </main>
    );
}

export default Home;