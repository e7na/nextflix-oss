from tkcalendar import DateEntry
from tkinter import Tk, Label, Entry, Button, END, messagebox
from tkinter.ttk import Combobox
import mysql.connector
import hashlib
import os
from dotenv import load_dotenv

load_dotenv()


class LoginController:
    def __init__(self, root):
        self.root = root

        label_passkey = Label(root, text="Passkey:")
        label_passkey.grid(row=0, column=0)

        self.passkey_entry = Entry(root, show="*")
        self.passkey_entry.grid(row=0, column=1)

        login_button = Button(root, text="Login", command=self.login)
        login_button.grid(row=1, column=0)

        close_button = Button(root, text="Close", command=root.destroy)
        close_button.grid(row=1, column=1)

    def login(self):
        passkey = self.passkey_entry.get()

        db = DbConnector()
        if company_id := db.validate_admin(passkey):
            self.open_insertion_ui(company_id)
        else:
            messagebox.showerror("Invalid Passkey", "Access Denied")

    def open_insertion_ui(self, company_id):
        self.root.destroy()  # Close the login window

        root = Tk()
        AddMediaController(root, company_id)
        root.mainloop()


def media_data(media):
    return (
        int(hashlib.sha256(str(media).encode("utf-8")).hexdigest(), 16) % 10**7,
        *media,
    )


class AddMediaController:
    def __init__(self, root, company_id):
        self.root = root
        self.company_id = company_id

        label_category = Label(root, text="Category:")
        self.category = Combobox(root, values=["Movie", "TV"])
        label_category.grid(row=0, column=0)
        self.category.grid(row=0, column=1)

        label_title = Label(root, text="Title:")
        self.title = Entry(root)
        label_title.grid(row=1, column=0)
        self.title.grid(row=1, column=1)

        label_poster = Label(root, text="Poster URL:")
        self.poster_url = Entry(root)
        label_poster.grid(row=2, column=0)
        self.poster_url.grid(row=2, column=1)

        label_backdrop = Label(root, text="Backdrop URL:")
        self.backdrop_url = Entry(root)
        label_backdrop.grid(row=3, column=0)
        self.backdrop_url.grid(row=3, column=1)

        label_description = Label(root, text="Description:")
        self.description = Entry(root)
        label_description.grid(row=4, column=0)
        self.description.grid(row=4, column=1)

        label_release_year = Label(root, text="Release Year:")
        self.release_year = DateEntry(root)
        label_release_year.grid(row=5, column=0)
        self.release_year.grid(row=5, column=1)

        label_rating = Label(root, text="Rating:")
        self.rating = Entry(root)
        label_rating.grid(row=6, column=0)
        self.rating.grid(row=6, column=1)

        label_popularity = Label(root, text="Popularity:")
        self.popularity = Entry(root)
        label_popularity.grid(row=7, column=0)
        self.popularity.grid(row=7, column=1)

        submit_button = Button(root, text="Submit", command=self.submit)
        submit_button.grid(row=8, column=0)

        close_button = Button(root, text="Close", command=root.destroy)
        close_button.grid(row=8, column=1)

        self.success_label = Label(root, text="", fg="green")
        self.success_label.grid(row=9, columnspan=2)

    def submit(self):
        category = self.category.get()
        title = self.title.get()
        poster_url = self.poster_url.get()
        backdrop_url = self.backdrop_url.get()
        description = self.description.get()
        release_year = self.release_year.get_date()
        rating = self.rating.get()
        popularity = self.popularity.get()

        db = DbConnector()
        media_id = db.insert_media(
            category,
            title,
            poster_url,
            backdrop_url,
            description,
            release_year,
            rating,
            popularity,
            self.company_id,
        )
        if media_id:
            self.clear()
            self.success_label.config(text="Media inserted successfully!")
        else:
            self.success_label.config(text="Error inserting media.")

    def clear(self):
        self.category.set("")
        self.title.delete(0, END)
        self.poster_url.delete(0, END)
        self.backdrop_url.delete(0, END)
        self.description.delete(0, END)
        self.release_year.delete(0, END)
        self.rating.delete(0, END)
        self.popularity.delete(0, END)


class DbConnector:
    def __init__(self):
        self.db_connection = None

    def connect(self):
        try:
            self.db_connection = mysql.connector.connect(
                host=os.getenv("HOST"),
                database=os.getenv("DATABASE"),
                user=os.getenv("USERNAME"),
                password=os.getenv("PASSWORD"),
            )
        except mysql.connector.Error as e:
            print("Error connecting to the database:", e)

    def insert_media(
        self,
        category,
        title,
        poster_url,
        backdrop_url,
        description,
        release_year,
        rating,
        popularity,
        company_id,
    ):
        self.connect()
        cursor = self.db_connection.cursor()
        insert_query = (
            "INSERT INTO Media ("
            "  MediaID"
            ", Category"
            ", Title"
            ", PosterURL"
            ", BackdropURL"
            ", Description"
            ", ReleaseYear"
            ", Rating"
            ", Popularity"
            ") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        )

        details = media_data(
            (
                category or None,
                title or None,
                poster_url or None,
                backdrop_url or None,
                description or None,
                release_year or None,
                rating or None,
                popularity or None,
            )
        )

        try:
            cursor.execute(insert_query, details)
            cursor.execute(
                "INSERT INTO CompanyHasMedia (CompanyID,MediaID) VALUES (%s, %s)",
                (company_id, details[0]),
            )
            self.db_connection.commit()
            cursor.close()
            self.db_connection.close()
            return details[0]
        except mysql.connector.Error as e:
            print("Error inserting media:", e)
            return None

    def validate_admin(self, passkey):
        self.connect()
        cursor = self.db_connection.cursor()
        select_query = "SELECT CompanyID FROM CompanyAgents WHERE Passkey = %s LIMIT 1"

        try:
            cursor.execute(select_query, (passkey,))
            (result,) = cursor.fetchone()
            cursor.close()
            self.db_connection.close()
            if result:
                return result
        except mysql.connector.Error as e:
            print("Error validating admin:", e)
            return False


root = Tk()
login_controller = LoginController(root)
root.mainloop()
