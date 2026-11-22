import { useState } from 'react'
import './App.css'

const ingredients = [
  { name: 'Курица', value: 'chicken' },
  { name: 'Говядина', value: 'beef' },
  { name: 'Рыба', value: 'fish' },
  { name: 'Яйца', value: 'eggs' },
  { name: 'Помидоры', value: 'tomato' },
  { name: 'Картофель', value: 'potato' },
  { name: 'Лук', value: 'onion' },
  { name: 'Чеснок', value: 'garlic' },
  { name: 'Сыр', value: 'cheese' },
  { name: 'Молоко', value: 'milk' },
  { name: 'Рис', value: 'rice' },
  { name: 'Макароны', value: 'pasta' },
  { name: 'Морковь', value: 'carrot' },
  { name: 'Перец', value: 'pepper' },
  { name: 'Грибы', value: 'mushrooms' },
]

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [message, setMessage] = useState('')

  function toggleIngredient(ingredient) {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter((item) => item !== ingredient))
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient])
    }

    setMessage('')
  }

  function handleSearch() {
    setMessage('Search soon.')
  }

  function clearIngredients() {
    setSelectedIngredients([])
    setMessage('')
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
              disabled={selectedIngredients.length === 0}
            >
              Подобрать рецепты <span>→</span>
            </button>
          </div>

          {message && <p className="message" role="status">{message}</p>}
        </section>

        <section className="next-section">
          <div>
            <h2>Рецепты</h2>
          </div>
        </section>
      </main>

      <footer className="footer">RecipeBook · Простые идеи для домашней кухни</footer>
    </div>
  )
}

export default App
