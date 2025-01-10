CREATE TABLE `staff` (
    `staff_id` VARCHAR(20) NOT NULL,
    `staff_name` VARCHAR(20) NOT NULL,
    `staff_role` VARCHAR(20) NOT NULL
) 


CREATE TABLE `vehicle` (
    `vehicle_id` VARCHAR(20) NOT NULL,
    `vehicle_type` VARCHAR(20) NOT NULL,
    `staff_id` VARCHAR(20) NOT NULL,
    `price` VARCHAR(20) NOT NULL,
    `available` VARCHAR(20) NOT NULL,
) 
