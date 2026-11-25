import { useState } from 'react'
import './App.css'
import { findRecipesByIngredients } from './mealApi'

const ingredients = [
  { name: 'Курица', apiName: 'chicken' },
  { name: 'Говядина', apiName: 'beef' },
  { name: 'Рыба', apiName: 'salmon' },
  { name: 'Яйца', apiName: 'egg' },
  { name: 'Помидоры', apiName: 'tomato' },
  { name: 'Картофель', apiName: 'potatoes' },
  { name: 'Лук', apiName: 'onion' },
  { name: 'Чеснок', apiName: 'garlic' },
  { name: 'Сыр', apiName: 'cheese' },
  { name: 'Молоко', apiName: 'milk' },
  { name: 'Рис', apiName: 'rice' },
  { name: 'Макароны', apiName: 'spaghetti' },
  { name: 'Морковь', apiName: 'carrot' },
  { name: 'Перец', apiName: 'pepper' },
  { name: 'Грибы', apiName: 'mushrooms' },
]

function getRecipeIngredients(recipe) {
  const result = []

  for (let i = 1; i <= 20; i++) {
    const name = recipe[`strIngredient${i}`]
    const measure = recipe[`strMeasure${i}`]

    if (name && name.trim() !== '') {
      result.push({
        name: name,
        measure: measure
      })
    }
  }

  return result
}

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [recipes, setRecipes] = useState([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState(null)

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
      selectedIngredients.includes(ingredient.apiName)
    )

    setIsLoading(true)
    setRecipes([])
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
                  selectedIngredients.includes(ingredient.apiName)
                    ? 'ingredient selected'
                    : 'ingredient'
                }
                key={ingredient.apiName}
                type="button"
                onClick={() => toggleIngredient(ingredient.apiName)}
              >
                <span className="ingredient-check">
                  {selectedIngredients.includes(ingredient.apiName) ? '✓' : '+'}
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

                    <div className="recipe-actions">
                      <button
                        className="details-button"
                        type="button"
                        onClick={() => setSelectedRecipe(recipe)}
                      >
                        Подробнее
                      </button>
                    </div>
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

        {selectedRecipe && (
          <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
            <div className="recipe-modal" role="dialog" aria-modal="true" 
            aria-labelledby="recipe-title" onClick={(event) => event.stopPropagation()}>
              <button
                className="modal-close"
                type="button"
                onClick={() => setSelectedRecipe(null)}
                aria-label="Закрыть"
              >
                ×
              </button>

              <img
                className="recipe-modal-image"
                src={selectedRecipe.strMealThumb}
                alt={selectedRecipe.strMeal}
              />

              <div className="recipe-modal-content">
                <p className="eyebrow">
                  {selectedRecipe.strArea} · {selectedRecipe.strCategory}
                </p>

                <h2 id="recipe-title">{selectedRecipe.strMeal}</h2>

                <h3>Ингредиенты</h3>

                <ul className="recipe-ingredients">
                  {getRecipeIngredients(selectedRecipe).map((ingredient, index) => (
                    <li key={index}>
                      <span>{ingredient.name}</span>
                      <span>{ingredient.measure}</span>
                    </li>
                  ))}
                </ul>

                <h3>Приготовление</h3>

                <p className="recipe-instructions">
                  {selectedRecipe.strInstructions || 'Инструкция отсутствует.'}
                </p>

                <div className="recipe-links">
                  {selectedRecipe.strSource && (
                    <a href={selectedRecipe.strSource} target="_blank" rel="noreferrer">
                      Источник рецепта
                    </a>
                  )}

                  {selectedRecipe.strYoutube && (
                    <a href={selectedRecipe.strYoutube} target="_blank" rel="noreferrer">
                      Видео приготовления
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  )
}

export default App