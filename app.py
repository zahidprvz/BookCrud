from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///books.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.static_folder = 'static'

db = SQLAlchemy(app)

class Book(db.Model):
    __tablename__ = 'books'
    BookId = db.Column(db.Integer, primary_key=True)
    Title = db.Column(db.String(80), nullable=False)
    PublishedYear = db.Column(db.Integer, nullable=False)
    Author = db.Column(db.String(80), nullable=False)
    Price = db.Column(db.Float, nullable=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    book_list = []
    for book in books:
        book_data = {
            'BookId': book.BookId,
            'Title': book.Title,
            'PublishedYear': book.PublishedYear,
            'Author': book.Author,
            'Price': book.Price
        }
        book_list.append(book_data)
    return jsonify(book_list)

@app.route('/books', methods=['POST'])
def add_book():
    data = request.get_json()
    title = data['title']
    published_year = data['publishedYear']
    author = data['author']
    price = data['price']
    new_book = Book(Title=title, PublishedYear=published_year, Author=author, Price=price)
    db.session.add(new_book)
    db.session.commit()
    return 'Book added successfully', 201

@app.route('/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    book = Book.query.get(book_id)
    if book:
        data = request.get_json()
        book.Title = data['title']
        book.PublishedYear = data['publishedYear']
        book.Author = data['author']
        book.Price = data['price']
        db.session.commit()
        return 'Book updated successfully', 200
    else:
        return 'Book not found', 404

@app.route('/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    book = Book.query.get(book_id)
    if book:
        db.session.delete(book)
        db.session.commit()
        return 'Book deleted successfully', 200
    else:
        return 'Book not found', 404

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
