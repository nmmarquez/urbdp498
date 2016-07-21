# Run this after loading the initial data set

LOAD DATA LOCAL INFILE '/home/nmarquez/Downloads/call_data.csv'
INTO TABLE test.call_data 
FIELDS OPTIONALLY ENCLOSED BY '"'
TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 3 LINES
(call_id,longitude,latitude, @var1, @var2, clearance_group_id, initial_group_id)
SET time = STR_TO_DATE(@var1, '%Y-%m-%d %H:%i:%s'),     
time_at_scene = STR_TO_DATE(@var2, '%Y-%m-%d %H:%i:%s');

SET SQL_SAFE_UPDATES = 0;

DELETE FROM test.call_data 
WHERE call_id = 0;

UPDATE test.call_data 
SET time_at_scene = NULL 
WHERE time_at_scene = str_to_date('0000-00-00 00:00:00', '%Y-%m-%d %H:%i:%s');

SET SQL_SAFE_UPDATES = 1;