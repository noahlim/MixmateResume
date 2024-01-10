import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import { Typography, CardContent } from "@mui/material";
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { isSet } from '@/app/_utilities/_client/utilities';
import { SEVERITY } from '@/app/_utilities/_client/constants';

function FilterRecipes_Component(props)
{
    // Variables
    let { recipeAllRecipes, recipeCategories, recipeAlcoholicTypes, recipeGlasses, recipeIngredients, showToastMessage, setRecipesFiltered } = props;
    const [selectedFilter, setSelectedFilter] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedGlass, setSelectedGlass] = useState('');
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [selectedAlcoholicType, setSelectedAlcoholicType] = useState('');
    let [recipeName, setRecipeName] = useState('');

    // Filter recipes controls
    let filterBy_onChange = (value) =>
    {
        setSelectedFilter(value);
        setSelectedCategory('');
        setSelectedGlass('');
        setSelectedIngredient('');
        setSelectedAlcoholicType('');
        setRecipeName('');
    }

    let btnClear_onClick = () =>
    {
        setSelectedFilter('');
        setSelectedCategory('');
        setSelectedGlass('');
        setSelectedIngredient('');
        setSelectedAlcoholicType('');
        setRecipeName('');
        setRecipesFiltered(recipeAllRecipes);
    }

    let btnFind_onClick = () =>
    {
        if(selectedCategory !== ''
        || selectedGlass !== ''
        || selectedIngredient !== ''
        || selectedAlcoholicType !== ''
        || recipeName !== '')
        {
            let filters = [];
            for(let x of recipeAllRecipes)
            {
                if(isSet(selectedCategory) && x.recipeCategory === selectedCategory)
                    filters.push(x);
                else if(isSet(selectedGlass) && x.recipeGlass === selectedGlass)
                    filters.push(x);
                else if(isSet(selectedIngredient) && x.recipeIngredients.some(k => k === selectedIngredient))
                    filters.push(x);
                else if(isSet(selectedAlcoholicType) && x.recipeAlcoholicType === selectedAlcoholicType)
                    filters.push(x);
                else if(isSet(recipeName) && x.recipeName.toLowerCase().includes(recipeName.toLowerCase()))
                    filters.push(x);
            }

            if(filters.length === 0)
                showToastMessage('Filter', 'No recipes found', SEVERITY.Info);
            else
                showToastMessage('Recipes', filters.length + ' recipe(s) found', SEVERITY.Success);

            setRecipesFiltered(filters);
        }
        else
            showToastMessage('Filter', 'No criteria to search', SEVERITY.Warning);
    }    

    return <>
        <Paper elevation={3} style={{ margin: 15 }}>

            <CardContent style={{ textAlign: "center", paddingTop: 25, paddingBottom: 0 }}>
                <Typography variant="h6">Filter recipes</Typography>
            </CardContent>

            {/* Filters */}
            <div style={{ padding: 25 }}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="filter-select-label">Filter by</InputLabel>
                    <Select
                        labelId="filter-select-label"
                        label="Filter by"
                        value={selectedFilter}
                        onChange={(e) => filterBy_onChange(e.target.value)}
                    >
                        {
                            ['Alcoholic Type', 'Category', 'Glass', 'Ingredient', 'Recipe Name'].map(f => {
                                return <MenuItem key={f} value={f}>{f}</MenuItem>;
                            })
                        }
                    </Select>
                </FormControl>
            </div>

            {/* Categories */}
            {
                selectedFilter === 'Category' &&
                <div style={{ padding: 25 }}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="category-select-label">Category</InputLabel>
                        <Select
                            labelId="category-select-label"
                            label="Category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {
                                recipeCategories?.map(cat => {
                                    return <MenuItem key={cat} value={cat}>{cat}</MenuItem>;
                                })
                            }
                        </Select>
                    </FormControl>
                </div>
            }

            {/* Glasses */}
            {
                selectedFilter === 'Glass' &&
                <div style={{ padding: 25 }}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="glass-select-label">Glass</InputLabel>
                        <Select
                            labelId="glass-select-label"
                            label="Glass"
                            value={selectedGlass}
                            onChange={(e) => setSelectedGlass(e.target.value)}
                        >
                            {
                                recipeGlasses?.map(glass => {
                                    return <MenuItem key={glass} value={glass}>{glass}</MenuItem>;
                                })
                            }
                        </Select>
                    </FormControl>
                </div>
            }

            {/* Ingredients */}
            {
                selectedFilter === 'Ingredient' &&
                <div style={{ padding: 25 }}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="ingredient-select-label">Ingredient</InputLabel>
                        <Select
                            labelId="ingredient-select-label"
                            label="Ingredient"
                            value={selectedIngredient}
                            onChange={(e) => setSelectedIngredient(e.target.value)}
                        >
                            {
                                recipeIngredients?.map(ingre => {
                                    return <MenuItem key={ingre} value={ingre}>{ingre}</MenuItem>;
                                })
                            }
                        </Select>
                    </FormControl>
                </div>
            }

            {/* Alcoholic types */}
            {
                selectedFilter === 'Alcoholic Type' &&
                <div style={{ padding: 25 }}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="alcoholictype-select-label">Alcoholic Type</InputLabel>
                        <Select
                            labelId="alcoholictype-select-label"
                            label="Alcoholic Type"
                            value={selectedAlcoholicType}
                            onChange={(e) => setSelectedAlcoholicType(e.target.value)}
                        >
                            {
                                recipeAlcoholicTypes?.map(at => {
                                    return <MenuItem key={at} value={at}>{at}</MenuItem>;
                                })
                            }
                        </Select>
                    </FormControl>
                </div>
            }

            {/* Recipe name */}
            {
                selectedFilter === 'Recipe Name' &&
                <div style={{ padding: 25 }}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel htmlFor="input-with-icon-adornment">Recipe name</InputLabel>
                        <Input id="input-with-icon-adornment"
                            startAdornment={<InputAdornment position="start"><LocalBarIcon /></InputAdornment>}
                            onChange={(e) => recipeName = e.target.value}
                        />
                    </FormControl>
                </div>
            }

            <CardContent style={{ textAlign: "center", paddingTop: 10, paddingBottom: 25 }}>
                <Button onClick={() => btnClear_onClick()} color="error" variant="contained" startIcon={<ClearIcon />}
                    style={{ marginRight: 7 }}>
                    Clear
                </Button>
                <Button onClick={() => btnFind_onClick()} color="primary" variant="contained" startIcon={<SearchIcon />}
                    style={{ marginLeft: 7 }}>
                    Find
                </Button>
            </CardContent>

        </Paper>
    </>;
}

export default FilterRecipes_Component;