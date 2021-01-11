--
-- Create Tables
--
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `Users`;
DROP TABLE IF EXISTS `Orders`;
DROP TABLE IF EXISTS `Items`;
DROP TABLE IF EXISTS `Item_order`;
SET FOREIGN_KEY_CHECKS = 1;


-- Table structure for table `Users`
CREATE TABLE Users(
    userID int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(255),
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    phoneNumber varchar(255)
);

-- Table structure for table `Orders`
CREATE TABLE Orders(
    orderID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userID int(11),
    CONSTRAINT FK_User FOREIGN KEY (userID)
    REFERENCES Users(userID),
    orderTime datetime NOT NULL,
    orderStatus varchar(255) NOT NULL,
    totalPrice float(8)
);

-- Table structure for table `Items`
CREATE TABLE Items(
    itemID int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(255) NOT NULL,
    unitPrice float(8) NOT NULL,
    calorie varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    picURL varchar(255) NOT NULL
);

-- Table structure for table `Item_order`
CREATE TABLE Item_order(
    itemOrderID int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    orderID BIGINT,
    CONSTRAINT FK_ItemOrder FOREIGN KEY (orderID)
    REFERENCES Orders(orderID),
    itemID int(11),
    CONSTRAINT FK_Item FOREIGN KEY (itemID)
    REFERENCES  Items(itemID),
    itemQuanity int(11) NOT NULL
);


--
-- Sample Data
--
use coffee_shop;

LOCK TABLES `Users` WRITE;
INSERT INTO Users (name, email, password, phoneNumber)
    VALUES
        ("customer1 Smith", "customer1@gmail.com", "$2a$10$I523Fla7Iz.z5KLQqSqdie6Zf/E/wQTMHAGQTHnij5XZ56haTGO.S", "0123456789"),
        ("customer2 Kate", "customer2@gmail.com", "$2a$10$I523Fla7Iz.z5KLQqSqdie6Zf/E/wQTMHAGQTHnij5XZ56haTGO.S", "1234567890"),
        ("customer3 Fox", "customer3@gmail.com", "$2a$10$I523Fla7Iz.z5KLQqSqdie6Zf/E/wQTMHAGQTHnij5XZ56haTGO.S", "1234567890"),
        ("customer4 John", "customer4@gmail.com", "$2a$10$I523Fla7Iz.z5KLQqSqdie6Zf/E/wQTMHAGQTHnij5XZ56haTGO.S", "1234567890");
UNLOCK TABLES;

INSERT INTO Items (itemID, name, unitPrice, calorie, description, picURL) VALUES (1, 'Americano', 1.2, 15, 'Espresso shots topped with hot water create a light layer of crema culminating in this wonderfully rich cup with depth and nuance.', 'https://globalassets.starbucks.com/assets/f12bc8af498d45ed92c5d6f1dac64062.jpg?impolicy=1by1_wide_1242');
INSERT INTO Items (itemID, name, unitPrice, calorie, description, picURL) VALUES (2, 'Cappuccino', 2.5, 120, 'Dark, rich espresso lies in wait under a smoothed and stretched layer of thick milk foam. An alchemy of barista artistry and craft.', 'https://globalassets.starbucks.com/assets/5c515339667943ce84dc56effdf5fc1b.jpg?impolicy=1by1_wide_1242');
INSERT INTO Items (itemID, name, unitPrice, calorie, description, picURL) VALUES (3, 'Espresso', 1.3, 10, 'Our smooth signature Espresso Roast with rich flavor and caramelly sweetness is at the very heart of everything we do.', 'https://globalassets.starbucks.com/assets/ec519dd5642c41629194192cce582135.jpg?impolicy=1by1_wide_1242');
INSERT INTO Items (itemID, name, unitPrice, calorie, description, picURL) VALUES (4, 'Mocha', 2.95, 360, 'Our rich, full-bodied espresso combined with bittersweet mocha sauce and steamed milk, then topped with sweetened whipped cream. The classic coffee drink that always sweetly satisfies.', 'https://globalassets.starbucks.com/assets/f4ec500b34624242b15c2d29e53f3c48.jpg?impolicy=1by1_wide_1242');
INSERT INTO Items (itemID, name, unitPrice, calorie, description, picURL) VALUES (5, 'FlatWhite', 2.39, 170, 'Smooth ristretto shots of espresso get the perfect amount of steamed whole milk to create a not-too-strong, not-too-creamy, just-right flavor.', 'https://globalassets.starbucks.com/assets/fedee22e49724cd09fbcc7ee2e567377.jpg?impolicy=1by1_wide_1242');


INSERT INTO Orders (orderID, userID, orderTime, orderStatus, totalPrice) VALUES (1, 1, '2020-10-16 23:40:22', 'completed', 1.5);
INSERT INTO Orders (orderID, userID, orderTime, orderStatus, totalPrice) VALUES (2, 2, '2020-10-16 22:40:56', 'ready for pick up', 1.2);
INSERT INTO Orders (orderID, userID, orderTime, orderStatus, totalPrice) VALUES (3, 4, '2020-10-16 21:31:20', 'processing', 2.7);
INSERT INTO Orders (orderID, userID, orderTime, orderStatus, totalPrice) VALUES (4, 3, '2020-10-16 21:41:42', 'placed', 3);
INSERT INTO Orders (orderID, userID, orderTime, orderStatus, totalPrice) VALUES (5, 1, '2020-10-16 23:56:45', 'placed', 1.2);

INSERT INTO Item_order (itemOrderID, orderID, itemID, itemQuanity) VALUES (1, 1, 2, 1);
INSERT INTO Item_order (itemOrderID, orderID, itemID, itemQuanity) VALUES (2, 2, 1, 1);
INSERT INTO Item_order (itemOrderID, orderID, itemID, itemQuanity) VALUES (3, 3, 1, 1);
INSERT INTO Item_order (itemOrderID, orderID, itemID, itemQuanity) VALUES (4, 3, 2, 1);
INSERT INTO Item_order (itemOrderID, orderID, itemID, itemQuanity) VALUES (5, 4, 2, 2);
INSERT INTO Item_order (itemOrderID, orderID, itemID, itemQuanity) VALUES (6, 5, 1, 1);
