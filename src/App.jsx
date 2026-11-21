import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");

  const [theme, setTheme] = useState(
    localStorage.getItem("country-explorer-theme") || "light"
  );

  // Toggle Dark and Light themes
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    localStorage.setItem("country-explorer-theme", newTheme);
  };

  // Fetch countries
  const fetchCountries = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://countries.trevorblades.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            {
              countries {
                code
                name
                capital
                emoji
                currency
                continent {
                  name
                }
              }
            }
          `,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to fetch countries.");
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error("Country data could not be loaded.");
      }

      const countryData = result.data.countries.map((country) => ({
        code: country.code,
        name: country.name,
        capital: country.capital,
        flag: country.emoji,
        currency: country.currency,
        region: country.continent.name,
      }));

      setCountries(countryData);
    } catch (err) {
      setError("Unable to load countries. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Filter countries
  const filteredCountries = countries.filter((country) => {
    const matchesSearch =
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.capital?.toLowerCase().includes(search.toLowerCase());

    const matchesRegion =
      region === "All" ||
      country.region === region ||
      (region === "Americas" &&
        (country.region === "North America" ||
          country.region === "South America"));

    return matchesSearch && matchesRegion;
  });

  const regions = [
    "All",
    "Asia",
    "Europe",
    "Africa",
    "Americas",
    "Oceania",
    "Antarctica",
  ];

  return (
    <div className={`app-container ${theme}`}>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">🌍</span>
          <span>Globe Explorer</span>
        </div>

        <div className="nav-right">
          <span className="nav-tag">WORLD DIRECTORY</span>

          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? (
              <>
                <span>🌙</span> Dark Mode
              </>
            ) : (
              <>
                <span>☀️</span> Light Mode
              </>
            )}
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">EXPLORE THE WORLD</span>

          <h1>
            Discover our
            <br />
            <span>beautiful planet.</span>
          </h1>

          <p>
            Explore countries, cultures, capitals and fascinating
            information from around the world.
          </p>

          <div className="hero-buttons">
            <button
              className="explore-btn"
              onClick={() =>
                document
                  .getElementById("country-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Countries <span>↓</span>
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="globe-circle">
            <span className="globe">🌎</span>
          </div>
          <div className="floating-card floating-card-one">
            ✈️ Explore the world
          </div>
          <div className="floating-card floating-card-two">
            🗺️ 195+ Countries
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">🌐</div>
          <div>
            <h2>{countries.length || "195+"}</h2>
            <p>Countries</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔎</div>
          <div>
            <h2>{filteredCountries.length}</h2>
            <p>Search Results</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🧭</div>
          <div>
            <h2>{region === "All" ? "7" : "1"}</h2>
            <p>Regions</p>
          </div>
        </div>
      </section>

      {/* COUNTRY SECTION */}
      <main id="country-section" className="country-section">
        <div className="section-heading">
          <div>
            <span className="section-label">COUNTRY DIRECTORY</span>
            <h2>Explore Countries</h2>
            <p>Find your next destination or learn something new.</p>
          </div>

          <button className="refresh-btn" onClick={fetchCountries}>
            ↻ Refresh
          </button>
        </div>

        {/* SEARCH */}
        <div className="search-container">
          <span className="search-icon">🔍</span>

          <input
            type="text"
            placeholder="Search country or capital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button className="clear-search" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>

        {/* REGION FILTER */}
        <div className="filter-section">
          <span className="filter-label">Filter by continent</span>

          <div className="filter-buttons">
            {regions.map((item) => (
              <button
                key={item}
                className={`region-btn ${region === item ? "active" : ""}`}
                onClick={() => setRegion(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS */}
        <div className="results-info">
          <span>
            Showing <strong>{filteredCountries.length}</strong> countries
          </span>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="loading-container">
            <div className="loader"></div>
            <h3>Exploring the world...</h3>
            <p>Loading country information</p>
          </div>
        )}

        {/* ERROR */}
        {error && !loading && (
          <div className="error-container">
            <span>⚠️</span>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button onClick={fetchCountries}>Try Again</button>
          </div>
        )}

        {/* COUNTRY CARDS */}
        {!loading && !error && filteredCountries.length > 0 && (
          <div className="countries-grid">
            {filteredCountries.map((country) => (
              <div className="country-card" key={country.code}>
                <div className="flag-container">
                  <img
                    className="country-flag"
                    src={`https://flagcdn.com/w320/${country.code.toLowerCase()}.png`}
                    alt={`${country.name} flag`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling.style.display = "flex";
                    }}
                  />

                  <div className="flag-fallback">
                    {country.flag}
                  </div>

                  <span className="country-code">
                    {country.code}
                  </span>
                </div>

                <div className="country-info">
                  <h3>{country.name}</h3>

                  <div className="country-detail">
                    <span>🏛️</span>
                    <div>
                      <small>Capital</small>
                      <p>{country.capital || "Not available"}</p>
                    </div>
                  </div>

                  <div className="country-detail">
                    <span>🌎</span>
                    <div>
                      <small>Continent</small>
                      <p>{country.region || "Not available"}</p>
                    </div>
                  </div>

                  <div className="country-detail">
                    <span>💰</span>
                    <div>
                      <small>Currency</small>
                      <p>{country.currency || "Not available"}</p>
                    </div>
                  </div>
                </div>

                <div className="country-card-footer">
                  <span>Discover more</span>
                  <span className="arrow">↗</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && !error && filteredCountries.length === 0 && (
          <div className="empty-container">
            <span>🔍</span>
            <h3>No countries found</h3>
            <p>Try searching with a different name or continent.</p>

            <button
              onClick={() => {
                setSearch("");
                setRegion("All");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">
          <span>🌍</span> Globe Explorer
        </div>

        <p>
          Discover the world, one country at a time.
        </p>

        <div className="footer-bottom">
          <span>© 2026 Globe Explorer</span>
          <span>Built with React</span>
        </div>
      </footer>
    </div>
  );
}

export default App;