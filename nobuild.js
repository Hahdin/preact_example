import { h, Component, render } from 'https://unpkg.com/preact?module';
import htm from 'https://unpkg.com/htm?module';
// Initialize htm with Preact
const html = htm.bind(h);

/**
 * functional component example
 */
const MyJumbo = () => {
  return html`
    <div class='jumbotron myextra'>
      <div class="text-center mytitle" id="title">Preact w/htm Example </div>
      <p class="info">Data retrieved from \
        <a href="https://jsonplaceholder.typicode.com/" target="blank">jsonplaceholder.typicode.com</a>, a great api for testing.
      <br/>
      <i>Build using <a href="https://preactjs.com/" target="blank">preact</a> \
        and <a href="https://github.com/developit/htm" target="blank">htm</i></a>.
      </p>
    </div>
  `;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { code: null };// track status
  }
    /**
   * Get a Post by its ID
   */
  getById() {
    const id = parseInt(document.getElementById('findby').value, 10);
    if (!id) {
      alert('no post id in query');
      return;
    }
    let spin = document.getElementById('getspan');
    spin.hidden = false;
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(response => {
        this.setState({code: response.status})
        return response.json();
      })
      .then(data => {
        this.resetTableBody();
        this.createTableRow(data);
      })
      .catch(error => console.error('fetch Error:', error))
      .finally(() => spin.hidden = true);
  }

  /**
   * Fetch all Posts
   */
  fetchAll() {
    let spin = document.getElementById('fetchspan');
    spin.hidden = false;
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        this.setState({code: response.status})
        return response.json();
      })
      .then(data => {
        this.resetTableBody();
        data.forEach(item => this.createTableRow(item));
      })
      .catch(error => console.error('fetch Error:', error))
      .finally(() => spin.hidden = true);
  }

  /**
   * Remove and replace the <tbody>
   */
  resetTableBody() {
    const table = document.getElementById('tableforall');
    let body = document.getElementById('tb');
    body.remove();

    body = document.createElement('tbody');
    body.setAttribute('id', 'tb');
    table.append(body);
  }

  /**
   * Create a table row
   * 
   * @param {object} item the data
   */
  createTableRow(item) {
    const keys = Object.keys(item);
    if (!keys.length) {
      alert(`Nothing found: http status ${this.state.code}`);
      return;
    }
    const tb = document.getElementById('tb');
    const row = document.createElement("TR");

    //first time create the headings
    const tableHeader = document.getElementById('thd');
    const addHeaders = !tableHeader.hasChildNodes();
    const hrow = addHeaders ? document.createElement("TR") : null;

    keys.forEach(key => {

      if (hrow) {
        const hcell = document.createElement('TH');
        hcell.innerHTML = key.toUpperCase();
        hrow.appendChild(hcell);
        tableHeader.appendChild(hrow);
      }

      const cell = document.createElement('TD');
      cell.innerHTML = item[key];
      row.appendChild(cell);
    });
    tb.appendChild(row)
  }

  /**
   * Render our page
   */
  render() {
    return html`
    <div class="container">
      <${MyJumbo} />
      <hr />
      <div class='row'>
        <div class="col-sm-6">
          <button type="button" class="btn btn-primary" onClick=${()=> this.fetchAll()}>
            <span id="fetchspan" hidden="true" class="spinner-border spinner-border-sm text-success"></span>
            Fetch all Posts
          </button>
        </div>
        <div class="col-sm-6">
          <button type="button" class="btn btn-primary" onClick=${()=> this.getById()}>
            <span id="getspan" hidden="true" class="spinner-border spinner-border-sm text-danger"></span>
            Find Post by id
          </button>
          <label>
            <input class="form-control" type="text" id="findby" />
          </label>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <table id="tableforall" class="table table-dark">
            <thead id='thd' />
            <tbody id='tb' />
          </table>
        </div>
      </div>
    </div>
    `;
  }
}
render(html`<${App} />`, document.body);