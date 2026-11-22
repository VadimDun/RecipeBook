import { useState } from 'react'
import './App.css'
import { findRecipesByIngredients } from './mealApi'

const ingredients = [
  { name: 'Курица', value: 'chicken', apiName: 'Chicken' },
  { name: 'Говядина', value: 'beef', apiName: 'Beef' },
  { name: 'Рыба', value: 'fish', apiName: 'Salmon' },
  { name: 'Яйца', value: 'eggs', apiName: 'Egg' },
  { name: 'Помидоры', value: 'tomato', apiName: 'Tomato' },
  { name: 'Картофель', value: 'potato', apiName: 'Potatoes' },
  { name: 'Лук', value: 'onion', apiName: 'Onion' },
  { name: 'Чеснок', value: 'garlic', apiName: 'Garlic' },
  { name: 'Сыр', value: 'cheese', apiName: 'Cheese' },
  { name: 'Молоко', value: 'milk', apiName: 'Milk' },
  { name: 'Рис', value: 'rice', apiName: 'Rice' },
  { name: 'Макароны', value: 'pasta', apiName: 'Spaghetti' },
  { name: 'Морковь', value: 'carrot', apiName: 'Carrot' },
  { name: 'Перец', value: 'pepper', apiName: 'Pepper' },
  { name: 'Грибы', value: 'mushrooms', apiName: 'Mushrooms' },
]

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [recipes, setRecipes] = useState([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  function toggleIngredient(ingredient) {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter((item) => item !== ingredient))
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient])
    }

    setRecipes([])
    setMessage('')
    setError('')
  }

  async function handleSearch() {
    const selected = ingredients.filter((ingredient) =>
      selectedIngredients.includes(ingredient.value)
    )

    setIsLoading(true)
    setRecipes([])
    setMessage('')
    setError('')

    try {
      const result = await findRecipesByIngredients(selected)

      setRecipes(result)

      if (result.length === 0) {
        setMessage('Рецепты не найдены. Попробуй выбрать другие ингредиенты.')
      }
    } catch {
      setError('Не удалось загрузить рецепты')
    }

    setIsLoading(false)
  }

  function clearIngredients() {
    setSelectedIngredients([])
    setRecipes([])
    setMessage('')
    setError('')
  }

  return (
    <div className="page">
      <header className="header">
        <a className="logo" href="#top">
          <span className="logo-icon">R</span>
          <span>RecipeBook</span>
        </a>
      </header>

      <main id="top">
        <section className="intro">
          <h1 className="intro-text">
            Выбери продукты и найди рецепты, для которых почти всё уже готово.
          </h1>
        </section>

        <section className="ingredient-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ШАГ 1</p>
              <h2>Выбери ингредиенты</h2>
            </div>

            <span className="selected-count">
              Выбрано: <strong>{selectedIngredients.length}</strong>
            </span>
          </div>

          <div className="ingredient-list">
            {ingredients.map((ingredient) => (
              <button
                className={
                  selectedIngredients.includes(ingredient.value)
                    ? 'ingredient selected'
                    : 'ingredient'
                }
                key={ingredient.value}
                type="button"
                onClick={() => toggleIngredient(ingredient.value)}
                aria-pressed={selectedIngredients.includes(ingredient.value)}
              >
                <span className="ingredient-check">
                  {selectedIngredients.includes(ingredient.value) ? '✓' : '+'}
                </span>
                {ingredient.name}
              </button>
            ))}
          </div>

          <div className="selection-footer">
            <button
              className="clear-button"
              type="button"
              onClick={clearIngredients}
              disabled={selectedIngredients.length === 0}
            >
              Очистить выбор
            </button>

            <button
              className="search-button"
              type="button"
              onClick={handleSearch}
              disabled={selectedIngredients.length === 0 || isLoading}
            >
              {isLoading ? 'Поиск...' : 'Подобрать рецепты'} <span>→</span>
            </button>
          </div>
        </section>

        <section className="recipes-section">
          <h2>Рецепты</h2>

          {isLoading && (
            <p className="message">Ищем подходящие рецепты...</p>
          )}

          {message && <p className="message">{message}</p>}

          {error && <p className="message error">{error}</p>}

          {!isLoading && recipes.length > 0 && (
            <div className="recipe-grid">
              {recipes.map((recipe) => (
                <article className="recipe-card" key={recipe.idMeal}>
                  <img src={recipe.strMealThumb} alt={recipe.strMeal} />

                  <div className="recipe-card-content">
                    <h3>{recipe.strMeal}</h3>

                    <div className="recipe-match">
                      <strong>{recipe.matchPercent}% совпадение</strong>
                      <span>
                        {recipe.matchedCount} из {recipe.totalIngredients} ингредиентов
                      </span>
                    </div>

                    <div className="match-bar">
                      <div
                        className="match-bar-fill"
                        style={{ width: `${recipe.matchPercent}%` }}
                      />
                    </div>

                    <p className="missing-ingredients">
                      <strong>Не хватает: </strong>
                      {recipe.missingIngredients.length > 0
                        ? recipe.missingIngredients.slice(0, 3).join(', ')
                        : 'Все ингредиенты есть'}
                      {recipe.missingIngredients.length > 3 && ' и другие'}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!isLoading && recipes.length === 0 && !message && !error && (
            <p className="empty-results">
              Выбери ингредиенты и нажми «Подобрать рецепты».
            </p>
          )}
        </section>
      </main>

      <footer className="footer">
        RecipeBook · Простые идеи для домашней кухни
      </footer>
    </div>
  )
}

export default App