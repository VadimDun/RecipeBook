const API_URL = 'https://www.themealdb.com/api/json/v1/1'

function normalizeIngredient(name) {
    return name.toLowerCase().replace(/[^a-z]/g, '')
}

function ingredientMatches(recipeIngredient, selectedIngredient) {
    const recipeName = normalizeIngredient(recipeIngredient)
    const selectedName = normalizeIngredient(selectedIngredient)

    return recipeName.includes(selectedName)
}

export async function findRecipesByIngredients(selectedIngredients) {
    const mealsByIngredient = await Promise.all(
        selectedIngredients.map(async (ingredient) => {
            const response = await fetch(`${API_URL}/filter.php?i=${ingredient.apiName}`)

            if (!response.ok) {
                throw new Error('Ошибка при загрузке рецептов')
            }

            const data = await response.json()
            return data.meals || []
        })
    )

    const recipeCounts = {}

    mealsByIngredient.forEach((meals) => {
        meals.forEach((meal) => {
            recipeCounts[meal.idMeal] = (recipeCounts[meal.idMeal] || 0) + 1
        })
    })

    const recipeIds = Object.keys(recipeCounts)
        .sort((a, b) => recipeCounts[b] - recipeCounts[a]).slice(0, 12)

    const recipes = await Promise.all(
        recipeIds.map(async (id) => {
            const response = await fetch(`${API_URL}/lookup.php?i=${id}`)

            if (!response.ok) {
                throw new Error('Ошибка при загрузке информации о блюде')
            }

            const data = await response.json()
            return data.meals ? data.meals[0] : null
        })
    )

    const result = recipes
        .filter((recipe) => recipe !== null)
        .map((recipe) => {
            const recipeIngredients = []

            for (let i = 1; i <= 20; i++) {
                const ingredient = recipe[`strIngredient${i}`]

                if (ingredient && ingredient.trim() !== '') {
                    recipeIngredients.push(ingredient.trim())
                }
            }

            const matchedIngredients = recipeIngredients.filter((ingredient) =>
                selectedIngredients.some((selected) =>
                    ingredientMatches(ingredient, selected.apiName)
                )
            )

            const missingIngredients = recipeIngredients.filter((ingredient) =>
                !selectedIngredients.some((selected) =>
                    ingredientMatches(ingredient, selected.apiName)
                )
            )

            const matchPercent = Math.round(
                (matchedIngredients.length / recipeIngredients.length) * 100
            )

            return {
                ...recipe,
                matchedCount: matchedIngredients.length,
                totalIngredients: recipeIngredients.length,
                matchPercent,
                missingIngredients,
            }
        })

    result.sort((a, b) => b.matchPercent - a.matchPercent)

    return result
}