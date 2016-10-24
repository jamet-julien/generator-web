# 2016-06-06
# ALTER TABLE  `background` ADD  `mode` VARCHAR( 63 ) NOT NULL DEFAULT  'standard' AFTER  `city`;

# 2016-06-13
# ALTER TABLE  `publis` CHANGE  `PASSE`  `PASSE` INT NOT NULL DEFAULT  '0';
# UPDATE  `accor`.`weather_country` SET  `actif` = b '0' WHERE  `weather_country`.`refweather` = 5128638;
# UPDATE  `accor`.`weather_country` SET  `actif` = b '1' WHERE  `weather_country`.`refweather` = 5128581;

# 2016-07-06
# CREATE TABLE IF NOT EXISTS `stats` (
#   `id` int(11) NOT NULL AUTO_INCREMENT,
#   `date` date NOT NULL,
#   `serial_event` varchar(31) NULL,
#   `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci NOT NULL,
#   PRIMARY KEY (`id`)
# ) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

#2016-07-07
ALTER TABLE  `stats` CHANGE  `date`  `date` DATETIME NOT NULL