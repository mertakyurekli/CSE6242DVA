// Databricks notebook source
// MAGIC %scala
// MAGIC // STARTER CODE - DO NOT EDIT THIS CELL
// MAGIC import org.apache.spark.sql.functions.desc
// MAGIC import org.apache.spark.sql.functions._
// MAGIC import org.apache.spark.sql.types._
// MAGIC import spark.implicits._
// MAGIC import org.apache.spark.sql.expressions.Window

// COMMAND ----------

// MAGIC %scala
// MAGIC // STARTER CODE - DO NOT EDIT THIS CELL
// MAGIC val customSchema = StructType(Array(StructField("lpep_pickup_datetime", StringType, true), StructField("lpep_dropoff_datetime", StringType, true), StructField("PULocationID", IntegerType, true), StructField("DOLocationID", IntegerType, true), StructField("passenger_count", IntegerType, true), StructField("trip_distance", FloatType, true), StructField("fare_amount", FloatType, true), StructField("payment_type", IntegerType, true)))

// COMMAND ----------

// MAGIC %scala
// MAGIC // STARTER CODE - YOU CAN LOAD ANY FILE WITH A SIMILAR SYNTAX.
// MAGIC val df = spark.read
// MAGIC    .format("com.databricks.spark.csv")
// MAGIC    .option("header", "true") // Use first line of all files as header
// MAGIC    .option("nullValue", "null")
// MAGIC    .schema(customSchema)
// MAGIC    .load("/FileStore/tables/nyc_tripdata.csv") // the csv file which you want to work with
// MAGIC    .withColumn("pickup_datetime", from_unixtime(unix_timestamp(col("lpep_pickup_datetime"), "MM/dd/yyyy HH:mm")))
// MAGIC    .withColumn("dropoff_datetime", from_unixtime(unix_timestamp(col("lpep_dropoff_datetime"), "MM/dd/yyyy HH:mm")))
// MAGIC    .drop($"lpep_pickup_datetime")
// MAGIC    .drop($"lpep_dropoff_datetime")

// COMMAND ----------

// MAGIC %scala
// MAGIC // LOAD THE "taxi_zone_lookup.csv" FILE SIMILARLY AS ABOVE. CAST ANY COLUMN TO APPROPRIATE DATA TYPE IF NECESSARY.
// MAGIC 
// MAGIC // ENTER THE CODE BELOW
// MAGIC val customSchema2 = StructType(Array(
// MAGIC   StructField("LocationID", IntegerType, true), 
// MAGIC   StructField("Borough", StringType, true),
// MAGIC   StructField("Zone", StringType, true),
// MAGIC   StructField("service_zone", StringType, true)))
// MAGIC val sparkDf = spark.read
// MAGIC    .format("com.databricks.spark.csv")
// MAGIC    .option("header", "true") // Use first line of all files as header
// MAGIC    .option("nullValue", "null")
// MAGIC    .schema(customSchema2)
// MAGIC    .load("/FileStore/tables/taxi_zone_lookup.csv") // the csv file which you want to work with
// MAGIC 
// MAGIC sparkDf.printSchema()

// COMMAND ----------

// STARTER CODE - DO NOT EDIT THIS CELL
// Some commands that you can use to see your dataframes and results of the operations. You can comment the df.show(5) and uncomment display(df) to see the data differently. You will find these two functions useful in reporting your results.
// display(df)
df.show(5) // view the first 5 rows of the dataframe

// COMMAND ----------

// STARTER CODE - DO NOT EDIT THIS CELL
// Filter the data to only keep the rows where "PULocationID" and the "DOLocationID" are different and the "trip_distance" is strictly greater than 2.0 (>2.0).

// VERY VERY IMPORTANT: ALL THE SUBSEQUENT OPERATIONS MUST BE PERFORMED ON THIS FILTERED DATA

val df_filter = df.filter($"PULocationID" =!= $"DOLocationID" && $"trip_distance" > 2.0)
df_filter.show(5)

// COMMAND ----------

// PART 1a: The top-5 most popular drop locations - "DOLocationID", sorted in descending order - if there is a tie, then one with lower "DOLocationID" gets listed first
// Output Schema: DOLocationID int, number_of_dropoffs int 

// Hint: Checkout the groupBy(), orderBy() and count() functions.

// ENTER THE CODE BELOW
df_filter.groupBy("DOLocationID").agg(count("DOLocationID").alias("number_of_dropoffs")).orderBy($"number_of_dropoffs".desc, $"DOLocationID".asc).show(5)

// COMMAND ----------

// PART 1b: The top-5 most popular pickup locations - "PULocationID", sorted in descending order - if there is a tie, then one with lower "PULocationID" gets listed first 
// Output Schema: PULocationID int, number_of_pickups int

// Hint: Code is very similar to part 1a above.

// ENTER THE CODE BELOW
df_filter.groupBy("PULocationID").agg(count("PULocationID").alias("number_of_pickups")).orderBy($"number_of_pickups".desc, $"PULocationID".asc).show(5)

// COMMAND ----------

// PART 2: List the top-3 locations with the maximum overall activity, i.e. sum of all pickups and all dropoffs at that LocationID. In case of a tie, the lower LocationID gets listed first.
// Output Schema: LocationID int, number_activities int

// Hint: In order to get the result, you may need to perform a join operation between the two dataframes that you created in earlier parts (to come up with the sum of the number of pickups and dropoffs on each location). 

// ENTER THE CODE BELOW
// join operation example: https://stackoverflow.com/questions/40343625/joining-spark-dataframes-on-the-key
val d1 = df_filter.groupBy("DOLocationID").agg(count("DOLocationID").alias("number_of_dropoffs")).orderBy($"number_of_dropoffs".desc, $"DOLocationID".asc)
val d2 = df_filter.groupBy("PULocationID").agg(count("PULocationID").alias("number_of_pickups")).orderBy($"number_of_pickups".desc, $"PULocationID".asc)

d1.join(d2, (col("DOLocationID") === col("PULocationID")).as("LocationID"), "inner").select(col("PULocationID").alias("LocationID"), ($"number_of_dropoffs" + $"number_of_pickups").alias("number_activities")).orderBy($"number_activities".desc, $"LocationID".asc).show(3)

// COMMAND ----------

// PART 3: List all the boroughs in the order of having the highest to lowest number of activities (i.e. sum of all pickups and all dropoffs at that LocationID), along with the total number of activity counts for each borough in NYC during that entire period of time.
// Output Schema: Borough string, total_number_activities int

// Hint: You can use the dataframe obtained from the previous part, and will need to do the join with the 'taxi_zone_lookup' dataframe. Also, checkout the "agg" function applied to a grouped dataframe.

// ENTER THE CODE BELOW
val d3 = d1.join(d2, (col("DOLocationID") === col("PULocationID")).as("LocationID"), "inner").select(col("PULocationID").alias("LocationID"), ($"number_of_dropoffs" + $"number_of_pickups").alias("number_activities")).orderBy($"number_activities".desc, $"LocationID".asc)

d3.alias("d3").join(sparkDf.alias("sparkDf"), $"d3.LocationID" === $"sparkDf.LocationID", "inner").select("number_activities", "Borough").groupBy("Borough").agg(sum("number_activities").alias("total_number_activities")).orderBy($"total_number_activities".desc).show()

// COMMAND ----------

df_filter.show(2)

// COMMAND ----------

// PART 4: List the top 2 days of week with the largest number of (daily) average pickups, along with the values of average number of pickups on each of the two days. The day of week should be a string with its full name, for example, "Monday" - not a number 1 or "Mon" instead.
// Output Schema: day_of_week string, avg_count float

// Hint: You may need to group by the "date" (without time stamp - time in the day) first. Checkout "to_date" function.

// ENTER THE CODE BELOW

// to_date() example: https://stackoverflow.com/questions/40656001/how-to-convert-timestamp-to-date-format-in-dataframe
// dayofweek() and date_format example:  https://stackoverflow.com/questions/25006607/how-to-get-day-of-week-in-sparksql
// df_filter.withColumn("pickup_date", to_date($"pickup_datetime")).withColumn("pickup_dayofweek", date_format(col("pickup_date"), "EEEE")).groupBy("pickup_dayofweek").agg(count("PULocationID").alias("number_of_pickups")).show(2)

df_filter.withColumn("pickup_date", to_date($"pickup_datetime")).groupBy($"pickup_date").agg(count($"PULocationID").alias("pickup_count")).withColumn("pickup_dayofweek", date_format(col("pickup_date"), "EEEE")).groupBy($"pickup_dayofweek").agg(avg("pickup_count").alias("avg_count")).orderBy($"avg_count".desc).limit(2).show()

// COMMAND ----------

// df_filter.withColumn("hour_of_day", hour(col("pickup_datetime"))).join(sparkDf, col("PULocationID") === col("LocationID"), "outer").filter($"Borough" === "Brooklyn").show(3)

// COMMAND ----------

// PART 5: For each particular hour of a day (0 to 23, 0 being midnight) - in their order from 0 to 23, find the zone in Brooklyn borough with the LARGEST number of pickups. 
// Output Schema: hour_of_day int, zone string, max_count int

// Hint: You may need to use "Window" over hour of day, along with "group by" to find the MAXIMUM count of pickups

// ENTER THE CODE BELOW
// hour() example:  https://sparkbyexamples.com/spark/spark-extract-hour-minute-and-second-from-timestamp/
val d5 = df_filter.withColumn("hour_of_day", hour(col("pickup_datetime"))).join(sparkDf, col("PULocationID") === col("LocationID"), "outer").filter($"Borough" === "Brooklyn").groupBy(col("hour_of_day"), col("Zone")).agg(count("Zone").alias("max_count")).select("hour_of_day", "Zone", "max_count")

// Window function:
val d5Rank = d5.select(col("hour_of_day"), col("Zone"), col("max_count"), rank().over(Window.partitionBy(col("hour_of_day")).orderBy(col("max_count").desc)).alias("rank"))

// Select rows where "rank" === 1 (i.e., largest number of pickups)
// https://stackoverflow.com/questions/64364563/scala-spark-use-window-function-to-find-max-value
d5Rank.select(col("hour_of_day"), col("Zone"), col("max_count")).where(col("rank") === 1).orderBy(col("hour_of_day")).show()

// COMMAND ----------

// PART 6 - Find which 3 different days of the January, in Manhattan, saw the largest percentage increment in pickups compared to previous day, in the order from largest increment % to smallest increment %. 
// Print the day of month along with the percent CHANGE (can be negative), rounded to 2 decimal places, in number of pickups compared to previous day.
// Output Schema: day int, percent_change float


// Hint: You might need to use lag function, over a window ordered by day of month.

// ENTER THE CODE BELOW
// lag function example:  https://stackoverflow.com/questions/41158115/spark-sql-window-function-lag
df_filter.join(sparkDf, col("PULocationID") === col("LocationID"), "outer").filter(month($"pickup_datetime") === 1 && $"Borough" === "Manhattan").withColumn("day", dayofmonth($"pickup_datetime")).groupBy(col("day")).agg(count("Zone").alias("current_count")).orderBy($"day".asc).withColumn("previous_count", lag("current_count", 1, 0).over(Window.orderBy("day"))).withColumn("percent_change", (($"current_count"-$"previous_count")/$"previous_count"*100)).select(col("day"), (bround($"percent_change", 2)).as("percent_change")).orderBy($"percent_change".desc).show(3)


// COMMAND ----------


