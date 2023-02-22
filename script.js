class MovieFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      results: [],
      error: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let { searchTerm } = this.state; // ES6 destructuring
    searchTerm = searchTerm.trim(); // clean the string
    if (!searchTerm) {
      // make sure the value isn't an empty string
      return; // early return
    }

    const json = (response) => response.json();

    fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=b7da8d63`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data.Response === "False") {
          throw new Error(data.Error);
        }

        if (data.Response === "True" && data.Search) {
          this.setState({ results: data.Search, error: "" });
        }
      })

      .catch((error) => {
        this.setState({ error: error.message });
        console.log("ERROR");
      });
  }

  render() {
    const { searchTerm, results, error } = this.state; // ES6 destructuring

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <form onSubmit={this.handleSubmit} className="form-inline my-4">
              <input
                type="text"
                className="form-control mr-sm-2"
                placeholder="frozen"
                value={searchTerm}
                onChange={this.handleChange}
              />
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
            {(() => {
              if (error) {
                return error;
              }
              return results.map((movie) => {
                return <Movie key={movie.imdbID} movie={movie} />;
              });
            })()}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<MovieFinder />, document.getElementById("root"));
