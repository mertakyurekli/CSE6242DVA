########################### DO NOT MODIFY THIS SECTION ##########################
#################################################################################
import sqlite3
from sqlite3 import Error
import csv
#################################################################################

## Change to False to disable Sample
SHOW = True

############### SAMPLE CLASS AND SQL QUERY ###########################
######################################################################
class Sample():
    def sample(self):
        try:
            connection = sqlite3.connect("sample")
            connection.text_factory = str
        except Error as e:
            print("Error occurred: " + str(e))
        print('\033[32m' + "Sample: " + '\033[m')
        
        # Sample Drop table
        connection.execute("DROP TABLE IF EXISTS sample;")
        # Sample Create
        connection.execute("CREATE TABLE sample(id integer, name text);")
        # Sample Insert
        connection.execute("INSERT INTO sample VALUES (?,?)",("1","test_name"))
        connection.commit()
        # Sample Select
        cursor = connection.execute("SELECT * FROM sample;")
        print(cursor.fetchall())

######################################################################

class HW2_sql():
    ############### DO NOT MODIFY THIS SECTION ###########################
    ######################################################################
    def create_connection(self, path):
        connection = None
        try:
            connection = sqlite3.connect(path)
            connection.text_factory = str
        except Error as e:
            print("Error occurred: " + str(e))
    
        return connection

    def execute_query(self, connection, query):
        cursor = connection.cursor()
        try:
            if query == "":
                return "Query Blank"
            else:
                cursor.execute(query)
                connection.commit()
                return "Query executed successfully"
        except Error as e:
            return "Error occurred: " + str(e)
    ######################################################################
    ######################################################################

    # GTusername [0 points]
    def GTusername(self):
        gt_username = "yyu441"
        return gt_username
    
    # Part a.i Create Tables [2 points]
    def part_ai_1(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_ai_1_sql = '''
            CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY,
            title TEXT,
            score REAL DEFAULT 0
        );
        '''
        ######################################################################
        
        return self.execute_query(connection, part_ai_1_sql)

    def part_ai_2(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_ai_2_sql = '''
            CREATE TABLE IF NOT EXISTS movie_cast (
                movie_id INTEGER,
                cast_id INTEGER,
                cast_name TEXT,
                birthday TEXT,
                popularity REAL DEFAULT 0,
                PRIMARY KEY (movie_id, cast_id)
            );
        '''
        ######################################################################
        
        return self.execute_query(connection, part_ai_2_sql)
    
    # Part a.ii Import Data [2 points]
    def part_aii_1(self,connection,path):
        ############### CREATE IMPORT CODE BELOW ############################
        cur = connection.cursor()
        with open('data/movies.csv', 'r', encoding='utf-8') as f:
            records = csv.reader(f, delimiter=',')
            for record in records:
                query1 = '''
                    INSERT INTO movies (id, title, score) VALUES ({}, '{}', {});
                '''.format(int(record[0]), str(record[1]), float(record[-1]))

                query2 = '''
                    INSERT INTO movies (id, title, score) VALUES ({}, "{}", {});
                '''.format(int(record[0]), str(record[1]), float(record[-1]))
                try:
                    cur.execute(query1)
                except:
                    cur.execute(query2)
        connection.commit()
       ######################################################################
        
        sql = "SELECT COUNT(id) FROM movies;"
        cursor = connection.execute(sql)
        return cursor.fetchall()[0][0]
    
    def part_aii_2(self,connection, path):
        ############### CREATE IMPORT CODE BELOW ############################
        # 1. insert all data into movie_cast.db
        with open('data/movie_cast.csv', 'r', encoding='utf-8') as f:
            records = csv.reader(f, delimiter=',')
            for record in records:
                query = '''
                    INSERT INTO movie_cast (movie_id, cast_id, cast_name, birthday, popularity) VALUES (?,?,?,?,?)
                '''
                connection.execute(query, tuple(record))
        connection.commit()
        ######################################################################
        
        sql = "SELECT COUNT(cast_id) FROM movie_cast;"
        cursor = connection.execute(sql)
        return cursor.fetchall()[0][0]

    # Part a.iii Vertical Database Partitioning [5 points]
    def part_aiii(self,connection):
        ############### EDIT CREATE TABLE SQL STATEMENT ###################################
        # 2. do vertical partitioning and create a new cast_bio table
        part_aiii_sql = '''
            CREATE TABLE cast_bio (
                cast_id INTEGER,
                cast_name TEXT,
                birthday TEXT,
                popularity REAL DEFAULT 0,
                PRIMARY KEY (cast_id),
                FOREIGN KEY (cast_id)
                    REFERENCES movie_cast (cast_id)
                        ON DELETE CASCADE
                        ON UPDATE NO ACTION
            )
        '''
        ######################################################################

        self.execute_query(connection, part_aiii_sql)
        
        ############### CREATE IMPORT CODE BELOW ############################
        part_aiii_insert_sql = '''
            INSERT INTO cast_bio 
                SELECT cast_id, cast_name, birthday, popularity FROM movie_cast
                GROUP BY cast_id, cast_name, birthday, popularity;
        '''
        ######################################################################
        
        self.execute_query(connection, part_aiii_insert_sql)
        
        sql = "SELECT COUNT(cast_id) FROM cast_bio;"
        cursor = connection.execute(sql)
        return cursor.fetchall()[0][0]
       

    # Part b Create Indexes [1 points]
    def part_b_1(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_b_1_sql = '''
            CREATE INDEX movie_index ON movies (id);
        '''
        ######################################################################
        return self.execute_query(connection, part_b_1_sql)
    
    def part_b_2(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_b_2_sql = '''
            CREATE INDEX cast_index ON movie_cast (cast_id);
        '''
        ######################################################################
        return self.execute_query(connection, part_b_2_sql)
    
    def part_b_3(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_b_3_sql = '''
            CREATE INDEX cast_bio_index ON cast_bio (cast_id);
        '''
        ######################################################################
        return self.execute_query(connection, part_b_3_sql)
    
    # Part c Calculate a Proportion [3 points]
    def part_c(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_c_sql = '''
            WITH temp1 AS (SELECT COUNT(DISTINCT title) AS counts FROM movies WHERE title LIKE "%war%" and score > 50),
            temp2 AS (SELECT ((CAST (temp1.counts AS FLOAT)) / CAST(COUNT(movies.title) AS FLOAT)) AS proportion FROM movies, temp1)
            SELECT printf("%.2f", proportion*100) FROM temp2 AS proportion;
        '''
        ######################################################################
        cursor = connection.execute(part_c_sql)
        return cursor.fetchall()[0][0]

    # Part d Find the Most Prolific Actors [4 points]
    def part_d(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_d_sql = '''
            SELECT cast_name, COUNT(DISTINCT movie_id) AS appearance_count
            FROM movie_cast AS mc
            WHERE mc.popularity > 10
            GROUP BY cast_name
            ORDER BY appearance_count DESC
            LIMIT 5;
        '''
        ######################################################################
        cursor = connection.execute(part_d_sql)
        return cursor.fetchall()

    # Part e Find the Highest Scoring Movies With the Least Amount of Cast [4 points]
    def part_e(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_e_sql = '''
            SELECT 
                title AS movie_title, 
                score AS movie_score, 
                COUNT(DISTINCT cast_id) AS cast_count
            FROM movie_cast
            INNER JOIN movies ON movie_cast.movie_id = movies.id
            GROUP BY movie_title
            ORDER BY movie_score DESC, cast_count ASC, movie_title ASC
            LIMIT 5;
        '''
        ######################################################################
        cursor = connection.execute(part_e_sql)
        return cursor.fetchall()
    
    # Part f Get High Scoring Actors [4 points]
    def part_f(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_f_sql = '''
            WITH temp1 AS (
                SELECT cast_id, AVG(score) AS average_score, COUNT(DISTINCT movie_id) AS counts
                FROM movies
                INNER JOIN movie_cast ON movies.id = movie_cast.movie_id
                WHERE score >= 25
                GROUP BY cast_id
            )
            SELECT DISTINCT mc.cast_id AS cast_id, cast_name, printf("%.2f", average_score) AS average_score
            FROM movie_cast AS mc
            LEFT JOIN temp1 on temp1.cast_id = mc.cast_id
            WHERE counts > 2
            ORDER BY average_score DESC, cast_name ASC
            LIMIT 10;
        '''
        ######################################################################
        cursor = connection.execute(part_f_sql)
        return cursor.fetchall()

    # Part g Creating Views [6 points]
    def part_g(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_g_sql = '''
            CREATE VIEW good_collaboration AS
                WITH temp1 AS (
                    SELECT title, score, movie_id, cast_id, cast_name
                    FROM movies
                    INNER JOIN movie_cast ON movies.id = movie_cast.movie_id
                ),
                temp2 AS (
                    SELECT 
                        t11.cast_id AS cast_member_id1, 
                        t12.cast_id AS cast_member_id2,
                        COUNT(t11.movie_id) AS movie_count,
                        AVG(t11.score) AS average_movie_score
                    FROM temp1 AS t11
                    INNER JOIN temp1 AS t12 ON 
                        (t11.cast_id < t12.cast_id AND
                        t11.movie_id = t12.movie_id)
                    GROUP BY t11.cast_id, t12.cast_id
                )
                SELECT cast_member_id1, cast_member_id2, movie_count, average_movie_score
                FROM temp2
                WHERE temp2.average_movie_score > 40 AND movie_count >= 3;
        '''
        ######################################################################
        return self.execute_query(connection, part_g_sql)
        # The following 4 lines are for debugging purpose only.
        # cursor = connection.execute(part_g_sql)
        # test = '''SELECT * FROM good_collaboration;'''
        # cursor = connection.execute(test)
        # return cursor.fetchall()
    
    def part_gi(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        #  For Q2.g.i, the goal is to find the 5 cast members with the highest collaboration_score, where
        #  collaboration_score is defined as the cast member's average average_movie_score. For example,
        #  for a cast_id of 123, look at all of the rows of the good_collaboration view which have either a
        #  cast_member_id1 of 123 or a cast_member_id2 of 123; for those rows, average the average_movie_score column,
        #  and that will give you the collaboration_score of cast_id 123.
        part_g_i_sql = '''
            WITH temp1 AS (SELECT cast_member_id1 AS cast_id FROM good_collaboration 
                            UNION 
                           SELECT cast_member_id2 FROM good_collaboration),
            temp2 AS (
                SELECT cast_id, AVG(average_movie_score) AS collaboration_score
                FROM temp1
                INNER JOIN good_collaboration AS g1 ON (temp1.cast_id = g1.cast_member_id1 
                                                     OR temp1.cast_id = g1.cast_member_id2)
                GROUP BY temp1.cast_id
            )
            SELECT DISTINCT temp2.cast_id AS cast_id, cast_name, printf("%.2f", collaboration_score) AS collaboration_score
            FROM temp2
            INNER JOIN movie_cast AS mc ON mc.cast_id = temp2.cast_id
            ORDER BY collaboration_score DESC, cast_name ASC
            LIMIT 5;
        '''
        ######################################################################
        cursor = connection.execute(part_g_i_sql)
        return cursor.fetchall()
    
    # Part h FTS [4 points]
    def part_h(self,connection,path):
        ############### EDIT SQL STATEMENT ###################################
        connection.execute('CREATE VIRTUAL TABLE IF NOT EXISTS movie_overview USING FTS3(id INTEGER, overview TEXT)');
        with open('data/movie_overview.csv', 'r', encoding='utf-8-sig') as f:
            records = csv.reader(f, delimiter=',')
            for record in records:
                query = '''
                    INSERT INTO movie_overview (id, overview) VALUES (?,?)
                '''
                connection.execute(query, tuple(record))
        connection.commit()
        # part_h_sql = '''
        #     INSERT INTO movie_overview (id, overview)
        #         SELECT * FROM
        # '''
        # ######################################################################
        # connection.execute(part_h_sql)
        ############### CREATE IMPORT CODE BELOW ############################
        
        ######################################################################
        sql = "SELECT COUNT(id) FROM movie_overview;"
        cursor = connection.execute(sql)
        return cursor.fetchall()[0][0]
        
    def part_hi(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_hi_sql = '''
            SELECT COUNT(overview) FROM movie_overview WHERE movie_overview MATCH 'fight OR fight.';
        '''
        ######################################################################
        cursor = connection.execute(part_hi_sql)
        return cursor.fetchall()[0][0]
    
    def part_hii(self,connection):
        ############### EDIT SQL STATEMENT ###################################
        part_hii_sql = '''
            SELECT COUNT(overview) FROM movie_overview WHERE movie_overview MATCH 'space NEAR/5 program;'
        '''
        ######################################################################
        cursor = connection.execute(part_hii_sql)
        return cursor.fetchall()[0][0]


if __name__ == "__main__":
    
    ########################### DO NOT MODIFY THIS SECTION ##########################
    #################################################################################
    if SHOW == True:
        sample = Sample()
        sample.sample()

    print('\033[32m' + "Q2 Output: " + '\033[m')
    db = HW2_sql()
    try:
        conn = db.create_connection("Q2")
    except:
        print("Database Creation Error")

    try:
        conn.execute("DROP TABLE IF EXISTS movies;")
        conn.execute("DROP TABLE IF EXISTS movie_cast;")
        conn.execute("DROP TABLE IF EXISTS cast_bio;")
        conn.execute("DROP VIEW IF EXISTS good_collaboration;")
        conn.execute("DROP TABLE IF EXISTS movie_overview;")
    except:
        print("Error in Table Drops")

    try:
        print('\033[32m' + "part ai 1: " + '\033[m' + str(db.part_ai_1(conn)))
        print('\033[32m' + "part ai 2: " + '\033[m' + str(db.part_ai_2(conn)))
    except:
         print("Error in Part a.i")

    try:
        print('\033[32m' + "Row count for Movies Table: " + '\033[m' + str(db.part_aii_1(conn,"data/movies.csv")))
        print('\033[32m' + "Row count for Movie Cast Table: " + '\033[m' + str(db.part_aii_2(conn,"data/movie_cast.csv")))
    except:
        print("Error in part a.ii")

    try:
        print('\033[32m' + "Row count for Cast Bio Table: " + '\033[m' + str(db.part_aiii(conn)))
    except:
        print("Error in part a.iii")

    try:
        print('\033[32m' + "part b 1: " + '\033[m' + db.part_b_1(conn))
        print('\033[32m' + "part b 2: " + '\033[m' + db.part_b_2(conn))
        print('\033[32m' + "part b 3: " + '\033[m' + db.part_b_3(conn))
    except:
        print("Error in part b")

    try:
        print('\033[32m' + "part c: " + '\033[m' + str(db.part_c(conn)))
    except:
        print("Error in part c")

    try:
        print('\033[32m' + "part d: " + '\033[m')
        for line in db.part_d(conn):
            print(line[0],line[1])
    except:
        print("Error in part d")

    try:
        print('\033[32m' + "part e: " + '\033[m')
        for line in db.part_e(conn):
            print(line[0],line[1],line[2])
    except:
        print("Error in part e")

    try:
        print('\033[32m' + "part f: " + '\033[m')
        for line in db.part_f(conn):
            print(line[0],line[1],line[2])
    except:
        print("Error in part f")

    print('Here starts checking G: ', db.part_g(conn))
    print('Here starts checking GI:' , db.part_gi(conn))
    try:
        print('\033[32m' + "part g: " + '\033[m' + str(db.part_g(conn)))
        print('\033[32m' + "part g.i: " + '\033[m')
        for line in db.part_gi(conn):
            print(line[0],line[1],line[2])
    except:
        print("Error in part g")

    print('Errors in part H: ', db.part_h(conn,"data/movie_overview.csv"))
    try:
        print('\033[32m' + "part h.i: " + '\033[m'+ str(db.part_h(conn,"data/movie_overview.csv")))
        print('\033[32m' + "Count h.ii: " + '\033[m' + str(db.part_hi(conn)))
        print('\033[32m' + "Count h.iii: " + '\033[m' + str(db.part_hii(conn)))
    except:
        print("Error in part h")

    conn.close()
    #################################################################################
    #################################################################################
  
