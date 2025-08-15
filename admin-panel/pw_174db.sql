-- Adminer 5.3.0 MariaDB 10.11.11-MariaDB-0+deb12u1 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

CREATE DATABASE `pw` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;
USE `pw`;

DELIMITER ;;

DROP PROCEDURE IF EXISTS `acquireuserpasswd`;;
CREATE PROCEDURE `acquireuserpasswd` (IN `name1` varchar(64), OUT `uid1` integer, OUT `passwd1` varchar(64))
BEGIN
    SELECT id, passwd INTO uid1, passwd1 FROM users WHERE name = name1;
END;;

DROP PROCEDURE IF EXISTS `addForbid`;;
CREATE PROCEDURE `addForbid` (IN `userid1` integer, IN `type1` integer, IN `forbid_time1` integer, IN `reason1` binary(255), IN `gmroleid1` integer)
BEGIN
 DECLARE rowcount INTEGER;
  START TRANSACTION;
    UPDATE forbid SET ctime = now(), forbid_time = forbid_time1, reason = reason1, gmroleid = gmroleid1 WHERE userid = userid1 AND type = type1;
    SET rowcount = ROW_COUNT();
    IF rowcount = 0 THEN
      INSERT INTO forbid VALUES(userid1, type1, now(), forbid_time1, reason1, gmroleid);
    END IF;
  COMMIT;
END;;

DROP PROCEDURE IF EXISTS `addGM`;;
CREATE PROCEDURE `addGM` (IN `userid` integer, IN `zoneid` integer)
BEGIN
  DECLARE x INTEGER;
  START TRANSACTION;
    SET x = 0;
    WHILE x < 12 DO
      INSERT INTO auth VALUES (userid, zoneid, x);
      SET x = x + 1;
    END WHILE;
    SET x = 100;
    WHILE x < 106 DO
      INSERT INTO auth VALUES (userid, zoneid, x);
      SET x = x + 1;
    END WHILE;
    SET x = 200;
    WHILE x < 215 DO
      INSERT INTO auth VALUES (userid, zoneid, x);
      SET x = x + 1;
    END WHILE;
    SET x = 500;
    WHILE x < 519 DO
      INSERT INTO auth VALUES (userid, zoneid, x);
      SET x = x + 1;
    END WHILE;
  COMMIT;
END;;

DROP PROCEDURE IF EXISTS `adduser`;;
CREATE PROCEDURE `adduser` (IN `name1` varchar(64), IN `passwd1` varchar(64), IN `prompt1` varchar(32), IN `answer1` varchar(32), IN `truename1` varchar(32), IN `idnumber1` varchar(32), IN `email1` varchar(32), IN `mobilenumber1` varchar(32), IN `province1` varchar(32), IN `city1` varchar(32), IN `phonenumber1` varchar(32), IN `address1` varchar(64), IN `postalcode1` varchar(8), IN `gender1` integer, IN `birthday1` varchar(32), IN `qq1` varchar(32), IN `passwd21` varchar(64))
BEGIN
  DECLARE idtemp INTEGER;
    SELECT IFNULL(MAX(id), 16) + 16 INTO idtemp FROM users;
    INSERT INTO users (id,name,passwd,prompt,answer,truename,idnumber,email,mobilenumber,province,city,phonenumber,address,postalcode,gender,birthday,creatime,qq,passwd2) VALUES( idtemp, name1, passwd1, prompt1, answer1, truename1, idnumber1, email1, mobilenumber1, province1, city1, phonenumber1, address1, postalcode1, gender1, birthday1, now(), qq1, passwd21 );
END;;

DROP PROCEDURE IF EXISTS `adduserpoint`;;
CREATE PROCEDURE `adduserpoint` (IN `uid1` integer, IN `aid1` integer, IN `time1` integer)
BEGIN
 DECLARE rowcount INTEGER;
 START TRANSACTION;
    UPDATE point SET time = IFNULL(time,0) + time1 WHERE uid1 = uid AND aid1 = aid;
    SET rowcount = ROW_COUNT();
    IF rowcount = 0 THEN
      INSERT INTO point (uid,aid,time) VALUES (uid1,aid1,time1);
    END IF;
  COMMIT;
END;;

DROP PROCEDURE IF EXISTS `addUserPriv`;;
CREATE PROCEDURE `addUserPriv` (IN `userid` integer, IN `zoneid` integer, IN `rid` integer)
BEGIN
  START TRANSACTION;
    INSERT INTO auth VALUES(userid, zoneid, rid);
  COMMIT;
END;;

DROP PROCEDURE IF EXISTS `changePasswd`;;
CREATE PROCEDURE `changePasswd` (IN `name1` varchar(64), IN `passwd1` varchar(64))
BEGIN
  START TRANSACTION;
    UPDATE users SET passwd = passwd1 WHERE name = name1;
  COMMIT;
END;;

DROP PROCEDURE IF EXISTS `changePasswd2`;;
CREATE PROCEDURE `changePasswd2` (IN `name1` varchar(64), IN `passwd21` varchar(64))
BEGIN
  START TRANSACTION;
    UPDATE users SET passwd2 = passwd21 WHERE name = name1;
  COMMIT;
END;;

DROP PROCEDURE IF EXISTS `clearonlinerecords`;;
CREATE PROCEDURE `clearonlinerecords` (IN `zoneid1` integer, IN `aid1` integer)
BEGIN
  START TRANSACTION;
    UPDATE point SET zoneid = NULL, zonelocalid = NULL WHERE aid = aid1 AND zoneid = zoneid1;
  COMMIT;
END;;

DROP PROCEDURE IF EXISTS `deleteTimeoutForbid`;;
CREATE PROCEDURE `deleteTimeoutForbid` (IN `userid1` integer)
BEGIN
  START TRANSACTION;
    DELETE FROM forbid WHERE userid = userid1 AND timestampdiff(second, ctime, now()) > forbid_time;
  COMMIT;
END;;

DROP PROCEDURE IF EXISTS `delUserPriv`;;
CREATE PROCEDURE `delUserPriv` (IN `userid1` integer, IN `zoneid1` integer, IN `rid1` integer, IN `deltype1` integer)
BEGIN
START TRANSACTION;
  IF deltype1 = 0 THEN
    DELETE FROM auth WHERE userid = userid1 AND zoneid = zoneid1 AND rid = rid1;
  ELSE
    IF deltype1 = 1 THEN
      DELETE FROM auth WHERE userid = userid1 AND zoneid = zoneid1;
    ELSE
      IF deltype1 = 2 THEN
        DELETE FROM auth WHERE userid = userid1;
      END IF;
    END IF;
  END IF;
COMMIT;
END;;

DROP PROCEDURE IF EXISTS `enableiplimit`;;
CREATE PROCEDURE `enableiplimit` (IN `uid1` integer, IN `enable1` char(1))
BEGIN
  DECLARE rowcount INTEGER;
  START TRANSACTION;
  UPDATE iplimit SET enable=enable1 WHERE uid=uid1;
  SET rowcount = ROW_COUNT();
  IF rowcount = 0 THEN
    INSERT INTO iplimit (uid,enable) VALUES (uid1,enable1);
  END IF;
  COMMIT;
END;;

DROP PROCEDURE IF EXISTS `lockuser`;;
CREATE PROCEDURE `lockuser` (IN `uid1` integer, IN `lockstatus1` char(1))
BEGIN
  DECLARE rowcount INTEGER;
  START TRANSACTION;
  UPDATE iplimit SET lockstatus=lockstatus1 WHERE uid=uid1;
  SET rowcount = ROW_COUNT();
  IF rowcount = 0 THEN
    INSERT INTO iplimit (uid,lockstatus,enable) VALUES (uid1,lockstatus1,'t');
  END IF;
  COMMIT;
END;;

DROP PROCEDURE IF EXISTS `recordoffline`;;
CREATE PROCEDURE `recordoffline` (IN `uid1` integer, IN `aid1` integer, INOUT `zoneid1` integer, INOUT `zonelocalid1` integer, INOUT `overwrite1` integer)
BEGIN
  DECLARE rowcount INTEGER;
  START TRANSACTION;
    UPDATE point SET zoneid = NULL, zonelocalid = NULL WHERE uid = uid1 AND aid = aid1 AND zoneid = zoneid1;
    SET rowcount = ROW_COUNT();
    IF overwrite1 = rowcount THEN
      SELECT zoneid, zonelocalid INTO zoneid1, zonelocalid1 FROM point WHERE uid = uid1 AND aid = aid1;
    END IF;
  COMMIT;
END;;

DROP PROCEDURE IF EXISTS `recordonline`;;
CREATE PROCEDURE `recordonline` (IN `uid1` integer, IN `aid1` integer, INOUT `zoneid1` integer, INOUT `zonelocalid1` integer, INOUT `overwrite` integer)
BEGIN
  DECLARE tmp_zoneid INTEGER;
  DECLARE tmp_zonelocalid INTEGER;
  DECLARE rowcount INTEGER;
  START TRANSACTION;
    SELECT SQL_CALC_FOUND_ROWS zoneid, zonelocalid INTO tmp_zoneid, tmp_zonelocalid FROM point WHERE uid = uid1 and aid = aid1;
    SET rowcount = FOUND_ROWS();
    IF rowcount = 0 THEN
      INSERT INTO point (uid, aid, time, zoneid, zonelocalid, lastlogin) VALUES (uid1, aid1, 0, zoneid1, zonelocalid1, now());
    ELSE IF tmp_zoneid IS NULL OR overwrite = 1 THEN
      UPDATE point SET zoneid = zoneid1, zonelocalid = zonelocalid1, lastlogin = now() WHERE uid = uid1 AND aid = aid1;
    END IF;
    END IF;
    IF tmp_zoneid IS NULL THEN
      SET overwrite = 1;
    ELSE
      SET zoneid1 = tmp_zoneid;
      SET zonelocalid1 = tmp_zonelocalid;
    END IF;
  COMMIT;
END;;

DROP PROCEDURE IF EXISTS `remaintime`;;
CREATE PROCEDURE `remaintime` (IN `uid1` integer, IN `aid1` integer, OUT `remain` integer, OUT `freetimeleft` integer)
BEGIN
  DECLARE enddate1 DATETIME;
  DECLARE now1 DATETIME;
  DECLARE rowcount INTEGER;
  START TRANSACTION;
  SET now1 = now();
  IF aid1 = 0 THEN
    SET remain = 86313600;
    SET enddate1 = date_add(now1, INTERVAL '30' DAY);
  ELSE
    SELECT time, IFNULL(enddate, now1) INTO remain, enddate1 FROM point WHERE uid = uid1 AND aid = aid1;
    SET rowcount = ROW_COUNT();
    IF rowcount = 0 THEN
      SET remain = 0;
      INSERT INTO point (uid,aid,time) VALUES (uid1, aid1, remain);
    END IF;
  END IF;
  SET freetimeleft = 0;
  IF enddate1 > now1 THEN
    SET freetimeleft = timestampdiff(second, now1, enddate1);
  END IF;
  COMMIT;
END;;

DROP PROCEDURE IF EXISTS `setiplimit`;;
CREATE PROCEDURE `setiplimit` (IN `uid1` integer, IN `ipaddr11` integer, IN `ipmask11` varchar(2), IN `ipaddr21` integer, IN `ipmask21` varchar(2), IN `ipaddr31` integer, IN `ipmask31` varchar(2), IN `enable1` char(1))
BEGIN
  DECLARE rowcount INTEGER;
  START TRANSACTION;
    UPDATE iplimit SET ipaddr1 = ipaddr11, ipmask1 = ipmask11, ipaddr2 = ipaddr21, ipmask2 = ipmask21, ipaddr3 = ipaddr31, ipmask3 = ipmask31 WHERE uid = uid1;
    SET rowcount = ROW_COUNT();
    IF rowcount = 0 THEN
      INSERT INTO iplimit (uid, ipaddr1, ipmask1, ipaddr2, ipmask2, ipaddr3, ipmask3, enable1) VALUES (uid1, ipaddr11, ipmask11, ipaddr21, ipmask21, ipaddr31, ipmask31,'t');
    END IF;
  COMMIT;
END;;

DROP PROCEDURE IF EXISTS `updateUserInfo`;;
CREATE PROCEDURE `updateUserInfo` (IN `name1` varchar(32), IN `prompt1` varchar(32), IN `answer1` varchar(32), IN `truename1` varchar(32), IN `idnumber1` varchar(32), IN `email1` varchar(32), IN `mobilenumber1` varchar(32), IN `province1` varchar(32), IN `city1` varchar(32), IN `phonenumber1` varchar(32), IN `address1` varchar(32), IN `postalcode1` varchar(32), IN `gender1` integer, IN `birthday1` varchar(32), IN `qq1` varchar(32))
BEGIN
  START TRANSACTION;
    UPDATE users SET prompt = prompt1, answer = answer1, truename = truename1, idnumber = idnumber1, email = email1, mobilenumber = mobilenumber1, province = province1, city = city1, phonenumber = phonenumber1, address = address1, postalcode = postalcode1, gender = gender1, birthday = birthda1, qq = qq1 WHERE name = name1;
  COMMIT;
END;;

DROP PROCEDURE IF EXISTS `usecash`;;
CREATE PROCEDURE `usecash` (IN `userid1` integer, IN `zoneid1` integer, IN `sn1` integer, IN `aid1` integer, IN `point1` integer, IN `cash1` integer, IN `status1` integer, OUT `error` integer)
BEGIN
DECLARE sn_old INTEGER;
DECLARE aid_old INTEGER;
DECLARE point_old INTEGER;
DECLARE cash_old INTEGER;
DECLARE status_old INTEGER;
DECLARE createtime_old DATETIME;
DECLARE time_old INTEGER;
DECLARE need_restore INTEGER;
DECLARE exists1 INTEGER;
DECLARE rowcount INTEGER;
START TRANSACTION;
  SET error = 0;
  SET need_restore = 0;
  SELECT SQL_CALC_FOUND_ROWS sn, aid, point, cash, status, creatime INTO sn_old, aid_old, point_old, cash_old, status_old, createtime_old FROM usecashnow WHERE userid = userid1 AND zoneid = zoneid1 AND sn >= 0;
  SET rowcount = FOUND_ROWS();
  IF rowcount = 1 THEN
    SET exists1 = 1;
  ELSE
    SET exists1 = 0;
  END IF;
  IF status1 = 0 THEN
    IF exists1 = 0 THEN
      SELECT aid, point INTO aid1, point1 FROM usecashnow WHERE userid = userid1 AND zoneid = zoneid1 AND sn = sn1;
      SET point1 = IFNULL(point1,0);
      UPDATE point SET time = time-point1 WHERE uid = userid1 AND aid = aid1 AND time >= point1;
      SET rowcount = ROW_COUNT();
      IF rowcount = 1 THEN
        UPDATE usecashnow SET sn = 0, status = 1 WHERE userid = userid1 AND zoneid = zoneid1 AND sn = sn1;
      ELSE
        SET error = -8;
      END IF;
    END IF;
  ELSE
    IF status1 = 1 THEN
      IF exists1 = 0 THEN
        UPDATE point SET time = time-point1 WHERE uid = userid1 AND aid = aid1 AND time >= point1;
        SET rowcount = ROW_COUNT();
        IF rowcount = 1 THEN
          INSERT INTO usecashnow (userid, zoneid, sn, aid, point, cash, status, creatime) VALUES (userid1, zoneid1, sn1, aid1, point1, cash1, status1, now());
        ELSE
          INSERT INTO usecashnow SELECT userid1, zoneid1, IFNULL(min(sn),0)-1, aid1, point1, cash1, 0, now() FROM usecashnow WHERE userid = userid1 AND zoneid = zoneid1 AND 0 >= sn;
          SET error = -8;
        END IF;
      ELSE
        INSERT INTO usecashnow SELECT userid1, zoneid1, IFNULL(min(sn),0)-1, aid1, point1, cash1, 0, now() FROM usecashnow WHERE userid = userid1 AND zoneid = zoneid1 AND 0 >= sn;
        SET error = -7;
      END IF;
    ELSE
      IF status1 = 2 THEN
        IF exists1 = 1 AND status_old = 1 AND sn_old = 0 THEN
          UPDATE usecashnow SET sn = sn1, status = status1 WHERE userid = userid1 AND zoneid = zoneid1 AND sn = sn_old;
        ELSE
          SET error = -9;
        END IF;
      ELSE
        IF status1 = 3 THEN
           IF exists1 = 1 AND status_old = 2 THEN
            UPDATE usecashnow SET status = status1 WHERE userid = userid1 AND zoneid = zoneid1 AND sn = sn_old;
           ELSE
            SET error = -10;
            END IF;
        ELSE
         IF status1 = 4 THEN
          IF exists1 = 1 THEN
            DELETE FROM usecashnow WHERE userid = userid1 AND zoneid = zoneid1 AND sn = sn_old;
            INSERT INTO usecashlog (userid, zoneid, sn, aid, point, cash, status, creatime, fintime) VALUES (userid1, zoneid1, sn_old, aid_old, point_old, cash_old, status1, createtime_old, now());
          END IF;
          IF NOT (exists1 = 1 AND status_old = 3) THEN
            SET error = -11;
          END IF;
        ELSE
          SET error = -12;
        END IF;
      END IF;
    END IF;
  END IF;
  END IF;
  IF need_restore = 1 THEN
    UPDATE point SET time = time+point_old WHERE uid = userid1 AND aid = aid_old;
    DELETE FROM usecashnow WHERE userid = userid1 AND zoneid = zoneid1 AND sn = sn_old;
    INSERT INTO usecashlog (userid, zoneid, sn, aid, point, cash, status, creatime, fintime) VALUES (userid1, zoneid1, sn_old, aid_old, point_old, cash_old, status1, createtime_old, now());
  END IF;
COMMIT;
END;;

DELIMITER ;

DROP TABLE IF EXISTS `arena_players`;
CREATE TABLE `arena_players` (
  `player_id` int(11) NOT NULL DEFAULT 0,
  `team_id` int(11) NOT NULL DEFAULT 0,
  `cls` int(11) NOT NULL DEFAULT 0,
  `score` int(11) NOT NULL DEFAULT 0,
  `win_count` int(11) NOT NULL DEFAULT 0,
  `team_score` int(11) NOT NULL DEFAULT 0,
  `week_battle_count` int(11) NOT NULL DEFAULT 0,
  `invite_time` int(11) NOT NULL DEFAULT 0,
  `last_visite` int(11) NOT NULL DEFAULT 0,
  `battle_count` int(11) NOT NULL DEFAULT 0,
  `name` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


DROP TABLE IF EXISTS `arena_rankings`;
CREATE TABLE `arena_rankings` (
  `roleid` int(11) NOT NULL,
  `rank_position` int(11) DEFAULT NULL,
  `points` int(11) DEFAULT 0,
  `last_update` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`roleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


DROP TABLE IF EXISTS `arena_settings`;
CREATE TABLE `arena_settings` (
  `week_time` int(11) NOT NULL DEFAULT 0,
  `max_bonus` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


DROP TABLE IF EXISTS `arena_teams`;
CREATE TABLE `arena_teams` (
  `team_id` int(11) NOT NULL AUTO_INCREMENT,
  `captain_id` int(11) NOT NULL DEFAULT 0,
  `team_type` int(11) NOT NULL DEFAULT 0,
  `score` int(11) NOT NULL DEFAULT 0,
  `last_visite` int(11) NOT NULL DEFAULT 0,
  `win_count` int(11) NOT NULL DEFAULT 0,
  `team_score` int(11) NOT NULL DEFAULT 0,
  `week_battle_count` int(11) NOT NULL DEFAULT 0,
  `create_time` int(11) NOT NULL DEFAULT 0,
  `battle_count` int(11) NOT NULL DEFAULT 0,
  `name` varchar(64) NOT NULL DEFAULT '''''',
  `members` text NOT NULL DEFAULT '',
  `teams` text NOT NULL DEFAULT '',
  PRIMARY KEY (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


DROP TABLE IF EXISTS `auth`;
CREATE TABLE `auth` (
  `userid` int(11) NOT NULL DEFAULT 0,
  `zoneid` int(11) NOT NULL DEFAULT 0,
  `rid` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`userid`,`zoneid`,`rid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

INSERT INTO `auth` (`userid`, `zoneid`, `rid`) VALUES
(1024,	1,	0),
(1024,	1,	1),
(1024,	1,	2),
(1024,	1,	3),
(1024,	1,	4),
(1024,	1,	5),
(1024,	1,	6),
(1024,	1,	7),
(1024,	1,	8),
(1024,	1,	9),
(1024,	1,	10),
(1024,	1,	11),
(1024,	1,	100),
(1024,	1,	101),
(1024,	1,	102),
(1024,	1,	103),
(1024,	1,	104),
(1024,	1,	105),
(1024,	1,	200),
(1024,	1,	201),
(1024,	1,	202),
(1024,	1,	203),
(1024,	1,	204),
(1024,	1,	205),
(1024,	1,	206),
(1024,	1,	207),
(1024,	1,	208),
(1024,	1,	209),
(1024,	1,	210),
(1024,	1,	211),
(1024,	1,	212),
(1024,	1,	213),
(1024,	1,	214),
(1024,	1,	215),
(1040,	1,	0),
(1040,	1,	1),
(1040,	1,	2),
(1040,	1,	3),
(1040,	1,	4),
(1040,	1,	5),
(1040,	1,	6),
(1040,	1,	7),
(1040,	1,	8),
(1040,	1,	9),
(1040,	1,	10),
(1040,	1,	11),
(1040,	1,	100),
(1040,	1,	101),
(1040,	1,	102),
(1040,	1,	103),
(1040,	1,	104),
(1040,	1,	105),
(1040,	1,	200),
(1040,	1,	201),
(1040,	1,	202),
(1040,	1,	203),
(1040,	1,	204),
(1040,	1,	205),
(1040,	1,	206),
(1040,	1,	207),
(1040,	1,	208),
(1040,	1,	209),
(1040,	1,	210),
(1040,	1,	211),
(1040,	1,	212),
(1040,	1,	213),
(1040,	1,	214),
(1040,	1,	215);

DROP TABLE IF EXISTS `forbid`;
CREATE TABLE `forbid` (
  `userid` int(11) NOT NULL DEFAULT 0,
  `type` int(11) NOT NULL DEFAULT 0,
  `ctime` datetime NOT NULL,
  `forbid_time` int(11) NOT NULL DEFAULT 0,
  `reason` blob NOT NULL,
  `gmroleid` int(11) DEFAULT 0,
  PRIMARY KEY (`userid`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


DROP TABLE IF EXISTS `gvg_events`;
CREATE TABLE `gvg_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_type` varchar(50) DEFAULT NULL,
  `guild_id` int(11) DEFAULT NULL,
  `territory_id` int(11) DEFAULT NULL,
  `event_time` datetime DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


DROP TABLE IF EXISTS `iplimit`;
CREATE TABLE `iplimit` (
  `uid` int(11) NOT NULL DEFAULT 0,
  `ipaddr1` int(11) DEFAULT 0,
  `ipmask1` varchar(2) DEFAULT '',
  `ipaddr2` int(11) DEFAULT 0,
  `ipmask2` varchar(2) DEFAULT '',
  `ipaddr3` int(11) DEFAULT 0,
  `ipmask3` varchar(2) DEFAULT '',
  `enable` char(1) DEFAULT '',
  `lockstatus` char(1) DEFAULT '',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


DROP TABLE IF EXISTS `player_storage`;
CREATE TABLE `player_storage` (
  `roleid` int(11) NOT NULL,
  `storage_key` varchar(255) NOT NULL,
  `storage_value` text DEFAULT NULL,
  PRIMARY KEY (`roleid`,`storage_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


DROP TABLE IF EXISTS `point`;
CREATE TABLE `point` (
  `uid` int(11) NOT NULL DEFAULT 0,
  `aid` int(11) NOT NULL DEFAULT 0,
  `time` int(11) NOT NULL DEFAULT 0,
  `zoneid` int(11) DEFAULT 0,
  `zonelocalid` int(11) DEFAULT 0,
  `accountstart` datetime DEFAULT NULL,
  `lastlogin` datetime DEFAULT NULL,
  `enddate` datetime DEFAULT NULL,
  PRIMARY KEY (`uid`,`aid`),
  KEY `IX_point_aidzoneid` (`aid`,`zoneid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

INSERT INTO `point` (`uid`, `aid`, `time`, `zoneid`, `zonelocalid`, `accountstart`, `lastlogin`, `enddate`) VALUES
(1024,	2,	0,	1,	133,	NULL,	'2025-08-13 21:09:16',	NULL),
(1040,	2,	0,	NULL,	NULL,	NULL,	'2025-08-06 16:31:43',	NULL);

DROP TABLE IF EXISTS `rank_data`;
CREATE TABLE `rank_data` (
  `roleid` int(11) NOT NULL,
  `exp_points` int(11) DEFAULT 0,
  `kills` int(11) DEFAULT 0,
  `deaths` int(11) DEFAULT 0,
  `check_status` int(11) DEFAULT 0,
  PRIMARY KEY (`roleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


DROP TABLE IF EXISTS `server_config`;
CREATE TABLE `server_config` (
  `config_key` varchar(255) NOT NULL,
  `config_value` text DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


DROP TABLE IF EXISTS `usecashlog`;
CREATE TABLE `usecashlog` (
  `userid` int(11) NOT NULL DEFAULT 0,
  `zoneid` int(11) NOT NULL DEFAULT 0,
  `sn` int(11) NOT NULL DEFAULT 0,
  `aid` int(11) NOT NULL DEFAULT 0,
  `point` int(11) NOT NULL DEFAULT 0,
  `cash` int(11) NOT NULL DEFAULT 0,
  `status` int(11) NOT NULL DEFAULT 0,
  `creatime` datetime NOT NULL,
  `fintime` datetime NOT NULL,
  KEY `IX_usecashlog_creatime` (`creatime`),
  KEY `IX_usecashlog_uzs` (`userid`,`zoneid`,`sn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


DROP TABLE IF EXISTS `usecashnow`;
CREATE TABLE `usecashnow` (
  `userid` int(11) NOT NULL DEFAULT 0,
  `zoneid` int(11) NOT NULL DEFAULT 0,
  `sn` int(11) NOT NULL DEFAULT 0,
  `aid` int(11) NOT NULL DEFAULT 0,
  `point` int(11) NOT NULL DEFAULT 0,
  `cash` int(11) NOT NULL DEFAULT 0,
  `status` int(11) NOT NULL DEFAULT 0,
  `creatime` datetime NOT NULL,
  PRIMARY KEY (`userid`,`zoneid`,`sn`),
  KEY `IX_usecashnow_creatime` (`creatime`),
  KEY `IX_usecashnow_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `ID` int(11) NOT NULL DEFAULT 0,
  `name` varchar(32) NOT NULL DEFAULT '',
  `passwd` varchar(64) DEFAULT NULL,
  `Prompt` varchar(32) NOT NULL DEFAULT '',
  `answer` varchar(32) NOT NULL DEFAULT '',
  `truename` varchar(32) NOT NULL DEFAULT '',
  `idnumber` varchar(32) NOT NULL DEFAULT '',
  `email` varchar(64) NOT NULL DEFAULT '',
  `mobilenumber` varchar(32) DEFAULT '',
  `province` varchar(32) DEFAULT '',
  `city` varchar(32) DEFAULT '',
  `phonenumber` varchar(32) DEFAULT '',
  `address` varchar(64) DEFAULT '',
  `postalcode` varchar(8) DEFAULT '',
  `gender` int(11) DEFAULT 0,
  `birthday` datetime DEFAULT NULL,
  `creatime` datetime NOT NULL,
  `qq` varchar(32) DEFAULT '',
  `passwd2` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `IX_users_name` (`name`),
  KEY `IX_users_creatime` (`creatime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

INSERT INTO `users` (`ID`, `name`, `passwd`, `Prompt`, `answer`, `truename`, `idnumber`, `email`, `mobilenumber`, `province`, `city`, `phonenumber`, `address`, `postalcode`, `gender`, `birthday`, `creatime`, `qq`, `passwd2`) VALUES
(1024,	'salles',	'JNjllCBvEQxDIHDiXaS8eA==',	'',	'',	'FSalles',	'',	'salles@salles',	'',	'',	'',	'',	'',	'',	0,	NULL,	'2025-08-01 21:26:20',	'',	NULL),
(1040,	'felipe',	'6XOzBCwUKReUobUG/x3qBg==',	'',	'',	'Felipe',	'',	'felipe@salles',	'',	'',	'',	'',	'',	'',	0,	NULL,	'2025-08-02 17:18:13',	'',	NULL);

DROP TABLE IF EXISTS `world_history`;
CREATE TABLE `world_history` (
  `history_key` varchar(255) NOT NULL,
  `history_value` text DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`history_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


-- 2025-08-14 01:45:18 UTC
