-- MySQL dump 10.13  Distrib 8.0.46, for Linux (aarch64)
--
-- Host: localhost    Database: muuu_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `COMPETENCIA`
--

DROP TABLE IF EXISTS `COMPETENCIA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `COMPETENCIA` (
  `id_competencia` bigint NOT NULL AUTO_INCREMENT,
  `fechaCompetencia` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `numeroRondas` int NOT NULL DEFAULT '5',
  `ganador` bigint DEFAULT NULL,
  `id_sala` bigint NOT NULL,
  PRIMARY KEY (`id_competencia`),
  KEY `FK_COMP_GANADOR` (`ganador`),
  KEY `FK_COMP_SALA` (`id_sala`),
  CONSTRAINT `FK_COMP_GANADOR` FOREIGN KEY (`ganador`) REFERENCES `USUARIO` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_COMP_SALA` FOREIGN KEY (`id_sala`) REFERENCES `SALA` (`id_sala`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `COMPETENCIA`
--

LOCK TABLES `COMPETENCIA` WRITE;
/*!40000 ALTER TABLE `COMPETENCIA` DISABLE KEYS */;
INSERT INTO `COMPETENCIA` VALUES (1,'2026-04-10 14:05:00',5,3,1),(2,'2026-04-15 10:10:00',5,4,2);
/*!40000 ALTER TABLE `COMPETENCIA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DIFICULTAD`
--

DROP TABLE IF EXISTS `DIFICULTAD`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DIFICULTAD` (
  `id_dificultad` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_dificultad`),
  UNIQUE KEY `UQ_DIFICULTAD_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DIFICULTAD`
--

LOCK TABLES `DIFICULTAD` WRITE;
/*!40000 ALTER TABLE `DIFICULTAD` DISABLE KEYS */;
INSERT INTO `DIFICULTAD` VALUES (3,'Avanzado'),(1,'Basico'),(2,'Intermedio');
/*!40000 ALTER TABLE `DIFICULTAD` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FLASHCARDS`
--

DROP TABLE IF EXISTS `FLASHCARDS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FLASHCARDS` (
  `id_flashcard` bigint NOT NULL AUTO_INCREMENT,
  `integral` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `respuestaCorrecta` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_tema` bigint NOT NULL,
  `id_dificultad` bigint NOT NULL,
  `id_usuario` bigint NOT NULL,
  `estado` enum('BORRADOR','PUBLICADO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BORRADOR',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_flashcard`),
  KEY `FK_FLASHCARD_TEMA` (`id_tema`),
  KEY `FK_FLASHCARD_DIFIC` (`id_dificultad`),
  KEY `FK_FLASHCARD_USUARIO` (`id_usuario`),
  CONSTRAINT `FK_FLASHCARD_DIFIC` FOREIGN KEY (`id_dificultad`) REFERENCES `DIFICULTAD` (`id_dificultad`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_FLASHCARD_TEMA` FOREIGN KEY (`id_tema`) REFERENCES `TEMA` (`id_tema`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_FLASHCARD_USUARIO` FOREIGN KEY (`id_usuario`) REFERENCES `USUARIO` (`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FLASHCARDS`
--

LOCK TABLES `FLASHCARDS` WRITE;
/*!40000 ALTER TABLE `FLASHCARDS` DISABLE KEYS */;
INSERT INTO `FLASHCARDS` VALUES (1,'Resuelve: integral de 2x por e^(x^2) dx','e^(x^2) + C',1,1,2,'PUBLICADO','2026-04-22 00:29:19'),(3,'Resuelve: integral de x por ln(x) dx','(x^2/2)·ln(x) − x^2/4 + C',2,2,2,'PUBLICADO','2026-04-22 00:29:19'),(4,'Resuelve: integral de 1/(x^2−1) dx','(1/2)·ln|(x−1)/(x+1)| + C',4,2,2,'PUBLICADO','2026-04-22 00:29:19'),(5,'Resuelve: integral de sen^2(x) dx','x/2 − sen(2x)/4 + C',5,2,2,'PUBLICADO','2026-04-22 00:29:19'),(6,'Resuelve: integral de x^2 por cos(x) dx','2x·cos(x)+(x^2−2)·sen(x) + C',2,3,2,'PUBLICADO','2026-04-22 00:29:19'),(7,'Resuelve: integral de 1/(1+x^2) dx','arctan(x) + C',1,1,2,'PUBLICADO','2026-04-22 00:29:19'),(10,'Resuelte ∫ 1/x dx','ln(x)+c',1,1,2,'PUBLICADO','2026-04-22 00:58:47'),(11,'prueba','‬‭‬aro',2,2,2,'BORRADOR','2026-04-22 02:41:47'),(12,'prueba 2∫ f(x) dx','esta si es',2,1,2,'PUBLICADO','2026-04-22 13:53:31'),(13,'∫ f(x) dx','X+C',2,3,11,'PUBLICADO','2026-04-29 00:22:20');
/*!40000 ALTER TABLE `FLASHCARDS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HISTORIAL_FLASHCARD`
--

DROP TABLE IF EXISTS `HISTORIAL_FLASHCARD`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HISTORIAL_FLASHCARD` (
  `id_historial` bigint NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint NOT NULL,
  `id_flashcard` bigint NOT NULL,
  `fechaVista` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `marcadaDificil` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_historial`),
  KEY `FK_HIST_USUARIO` (`id_usuario`),
  KEY `FK_HIST_FLASHCARD` (`id_flashcard`),
  CONSTRAINT `FK_HIST_FLASHCARD` FOREIGN KEY (`id_flashcard`) REFERENCES `FLASHCARDS` (`id_flashcard`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_HIST_USUARIO` FOREIGN KEY (`id_usuario`) REFERENCES `USUARIO` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HISTORIAL_FLASHCARD`
--

LOCK TABLES `HISTORIAL_FLASHCARD` WRITE;
/*!40000 ALTER TABLE `HISTORIAL_FLASHCARD` DISABLE KEYS */;
INSERT INTO `HISTORIAL_FLASHCARD` VALUES (1,3,1,'2026-04-15 09:00:00',0),(3,3,3,'2026-04-15 09:10:00',1),(4,3,4,'2026-04-16 10:00:00',0),(5,3,5,'2026-04-16 10:05:00',1),(6,3,6,'2026-04-17 08:00:00',0),(7,3,7,'2026-04-18 08:10:00',0),(8,4,1,'2026-04-15 11:00:00',0),(10,4,3,'2026-04-16 09:00:00',1),(11,4,7,'2026-04-17 09:15:00',0),(12,5,1,'2026-04-14 14:00:00',0),(13,5,4,'2026-04-14 14:10:00',1),(14,5,5,'2026-04-15 16:00:00',0),(15,1,1,'2026-04-20 10:00:00',0),(17,1,7,'2026-04-21 09:00:00',0);
/*!40000 ALTER TABLE `HISTORIAL_FLASHCARD` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MATERIAL`
--

DROP TABLE IF EXISTS `MATERIAL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MATERIAL` (
  `id_material` bigint NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `urlArchivo` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numeroPaginas` int DEFAULT NULL,
  `fechaCarga` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_tema` bigint NOT NULL,
  `id_usuario` bigint NOT NULL,
  `id_dificultad` bigint NOT NULL,
  PRIMARY KEY (`id_material`),
  KEY `FK_MAT_TEMA` (`id_tema`),
  KEY `FK_MAT_USUARIO` (`id_usuario`),
  KEY `FK_MAT_DIFIC` (`id_dificultad`),
  CONSTRAINT `FK_MAT_DIFIC` FOREIGN KEY (`id_dificultad`) REFERENCES `DIFICULTAD` (`id_dificultad`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_MAT_TEMA` FOREIGN KEY (`id_tema`) REFERENCES `TEMA` (`id_tema`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_MAT_USUARIO` FOREIGN KEY (`id_usuario`) REFERENCES `USUARIO` (`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MATERIAL`
--

LOCK TABLES `MATERIAL` WRITE;
/*!40000 ALTER TABLE `MATERIAL` DISABLE KEYS */;
INSERT INTO `MATERIAL` VALUES (1,'Guia completa: Integracion por Partes','PDF','https://storage.muuu.app/materiales/integ-partes.pdf',12,'2026-04-22 00:29:19',2,2,2),(3,'Resumen: Fracciones Parciales','RESUMEN','https://storage.muuu.app/resumenes/frac-parciales.pdf',4,'2026-04-22 00:29:19',4,6,2),(6,'taller dos','PDF','/uploads/69f14872d5959_1777420402.pdf',NULL,'2026-04-22 00:48:54',1,2,1),(8,'docente prueba 3','PDF','/uploads/69e83d296f391_1776827689.pdf',NULL,'2026-04-22 03:14:49',1,2,1),(9,'Trailer de Muuu','LINK','https://youtu.be/CPo8rHwXeVM?si=9uF95LF0HxrfzRek',NULL,'2026-04-29 00:05:01',1,2,1),(10,'PRUEBA 4','PDF','/uploads/69f14f662dfd4_1777422182.pdf',NULL,'2026-04-29 00:23:02',4,11,2);
/*!40000 ALTER TABLE `MATERIAL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OPCIONES_RESPUESTA`
--

DROP TABLE IF EXISTS `OPCIONES_RESPUESTA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OPCIONES_RESPUESTA` (
  `id_opcion` bigint NOT NULL AUTO_INCREMENT,
  `contenidoRespuesta` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `esCorrecta` tinyint(1) NOT NULL DEFAULT '0',
  `retroalimentacion` text COLLATE utf8mb4_unicode_ci,
  `id_flashcard` bigint NOT NULL,
  PRIMARY KEY (`id_opcion`),
  KEY `FK_OPCION_FLASHCARD` (`id_flashcard`),
  CONSTRAINT `FK_OPCION_FLASHCARD` FOREIGN KEY (`id_flashcard`) REFERENCES `FLASHCARDS` (`id_flashcard`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OPCIONES_RESPUESTA`
--

LOCK TABLES `OPCIONES_RESPUESTA` WRITE;
/*!40000 ALTER TABLE `OPCIONES_RESPUESTA` DISABLE KEYS */;
INSERT INTO `OPCIONES_RESPUESTA` VALUES (1,'e^(x^2) + C',1,'Correcto. Sustituyendo u=x^2, du=2x dx, la integral se reduce a integral de e^u du = e^u + C.',1),(2,'2·e^(x^2) + C',0,'Incorrecto. El factor 2 ya aparece en du = 2x dx; no se duplica en el resultado.',1),(3,'x·e^(x^2) + C',0,'Incorrecto. La antiderivada de e^(x^2) no incluye el factor x aislado.',1),(4,'e^(2x) + C',0,'Incorrecto. El exponente es x^2, no 2x.',1),(9,'(x^2/2)·ln(x) − x^2/4 + C',1,'Correcto. Partes con u=ln(x), dv=x dx.',3),(10,'x^2·ln(x)/2 + C',0,'Incorrecto. Falta el termino de la integral resultante.',3),(11,'ln(x)/x + C',0,'Incorrecto. Esa es la derivada de ln(x), no la antiderivada.',3),(12,'x·ln(x) − x + C',0,'Incorrecto. Esa formula corresponde a integral de ln(x) dx.',3),(13,'(1/2)·ln|(x−1)/(x+1)| + C',1,'Correcto. Fracciones parciales: 1/(x^2−1) = A/(x−1) + B/(x+1).',4),(14,'ln|x^2−1| + C',0,'Incorrecto. No se puede integrar directamente el logaritmo del denominador.',4),(15,'arctan(x) + C',0,'Incorrecto. arctan(x) corresponde a integral de 1/(1+x^2) dx.',4),(16,'(1/2)·ln|x+1| + C',0,'Incorrecto. Falta el termino con (x−1).',4),(17,'arctan(x) + C',1,'Correcto. Integral inmediata estandar: integral de 1/(1+x^2) dx = arctan(x) + C.',7),(18,'arcsen(x) + C',0,'Incorrecto. arcsen(x) corresponde a integral de 1/raiz(1−x^2) dx.',7),(19,'ln(1+x^2) + C',0,'Incorrecto. ln(1+x^2)/2 seria la antiderivada de x/(1+x^2).',7),(20,'tan(x) + C',0,'Incorrecto. La antiderivada de tan(x) es −ln|cos(x)|+C.',7),(25,'ln(x)',0,'no',10),(26,'ln(x)+c',1,'si',10),(27,'c',0,'no',10),(28,'',0,'',10),(29,'‬‭‬aro',1,'jajaj',11),(30,'no',0,'jajaja',11),(31,'',0,'',11),(32,'',0,'',11),(33,'esta no es',0,'',12),(34,'esta si es',1,'',12),(35,'no',0,'',12),(36,'no',0,'',12),(37,'x',0,'',13),(38,'A',0,'',13),(39,'C',0,'',13),(40,'X+C',1,'',13);
/*!40000 ALTER TABLE `OPCIONES_RESPUESTA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROGRESO_MATERIAL`
--

DROP TABLE IF EXISTS `PROGRESO_MATERIAL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROGRESO_MATERIAL` (
  `id_progreso` bigint NOT NULL AUTO_INCREMENT,
  `porcentaje` int NOT NULL DEFAULT '0',
  `completado` tinyint(1) NOT NULL DEFAULT '0',
  `fechaUltimoAcceso` datetime DEFAULT NULL,
  `id_usuario` bigint NOT NULL,
  `id_material` bigint NOT NULL,
  PRIMARY KEY (`id_progreso`),
  UNIQUE KEY `UQ_PROG_USR_MAT` (`id_usuario`,`id_material`),
  KEY `FK_PROG_MATERIAL` (`id_material`),
  CONSTRAINT `FK_PROG_MATERIAL` FOREIGN KEY (`id_material`) REFERENCES `MATERIAL` (`id_material`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_PROG_USUARIO` FOREIGN KEY (`id_usuario`) REFERENCES `USUARIO` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROGRESO_MATERIAL`
--

LOCK TABLES `PROGRESO_MATERIAL` WRITE;
/*!40000 ALTER TABLE `PROGRESO_MATERIAL` DISABLE KEYS */;
INSERT INTO `PROGRESO_MATERIAL` VALUES (1,100,1,'2026-04-16 08:00:00',3,1),(3,100,1,'2026-04-15 11:00:00',4,1),(4,30,0,'2026-04-14 14:00:00',5,3);
/*!40000 ALTER TABLE `PROGRESO_MATERIAL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RANKING`
--

DROP TABLE IF EXISTS `RANKING`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RANKING` (
  `id_ranking` bigint NOT NULL AUTO_INCREMENT,
  `posicion` int NOT NULL,
  `puntos` int NOT NULL DEFAULT '0',
  `puntosParaPodio` int DEFAULT NULL,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `id_usuario` bigint NOT NULL,
  PRIMARY KEY (`id_ranking`),
  UNIQUE KEY `UQ_RANKING_USUARIO` (`id_usuario`),
  CONSTRAINT `FK_RANKING_USUARIO` FOREIGN KEY (`id_usuario`) REFERENCES `USUARIO` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RANKING`
--

LOCK TABLES `RANKING` WRITE;
/*!40000 ALTER TABLE `RANKING` DISABLE KEYS */;
INSERT INTO `RANKING` VALUES (1,1,1850,0,'2026-04-22 00:29:19',3),(2,2,1400,0,'2026-04-22 00:29:19',4),(3,3,1300,0,'2026-04-22 00:29:19',5),(4,4,800,500,'2026-04-22 00:29:19',1),(5,5,750,550,'2026-04-22 00:29:19',8),(6,6,300,1000,'2026-04-22 00:29:19',9);
/*!40000 ALTER TABLE `RANKING` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ROL`
--

DROP TABLE IF EXISTS `ROL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ROL` (
  `id_rol` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `UQ_ROL_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ROL`
--

LOCK TABLES `ROL` WRITE;
/*!40000 ALTER TABLE `ROL` DISABLE KEYS */;
INSERT INTO `ROL` VALUES (1,'ESTUDIANTE','Usuario que estudia y participa en desafios'),(2,'DOCENTE','Usuario que carga material y disena flashcards');
/*!40000 ALTER TABLE `ROL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SALA`
--

DROP TABLE IF EXISTS `SALA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SALA` (
  `id_sala` bigint NOT NULL AUTO_INCREMENT,
  `codigoSala` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaExpiracion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_sala`),
  UNIQUE KEY `UQ_SALA_codigo` (`codigoSala`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SALA`
--

LOCK TABLES `SALA` WRITE;
/*!40000 ALTER TABLE `SALA` DISABLE KEYS */;
INSERT INTO `SALA` VALUES (1,'MUUU-A1B2','2026-04-10 14:00:00','2026-04-10 14:30:00'),(2,'MUUU-C3D4','2026-04-15 10:00:00','2026-04-15 10:30:00');
/*!40000 ALTER TABLE `SALA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TEMA`
--

DROP TABLE IF EXISTS `TEMA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TEMA` (
  `id_tema` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icono` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_tema`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TEMA`
--

LOCK TABLES `TEMA` WRITE;
/*!40000 ALTER TABLE `TEMA` DISABLE KEYS */;
INSERT INTO `TEMA` VALUES (1,'Formulas de Integrales Inmediatas','Integrales directas de la tabla estandar','📋'),(2,'Integracion por Partes — ILATE','Metodo integral u dv = uv menos integral v du (ILATE)','🐄'),(3,'Sustitucion Trigonometrica','Sustitucion con seno, coseno o tangente','📐'),(4,'Fracciones Parciales','Descomposicion de fracciones racionales','✂️'),(5,'Identidades Trigonometricas para Reduccion de Potencias','Reduccion de potencias con identidades trigonometricas','🔢'),(6,'Teorema Fundamental del Calculo','Relacion entre derivacion e integracion','⚖️'),(7,'Propiedades de la Integral Definida','Linealidad, aditividad y acotamiento','📊');
/*!40000 ALTER TABLE `TEMA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USUARIO`
--

DROP TABLE IF EXISTS `USUARIO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USUARIO` (
  `id_usuario` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `esActivo` tinyint(1) NOT NULL DEFAULT '1',
  `fechaRegistro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_rol` bigint NOT NULL,
  `rachaActual` int DEFAULT '0',
  `fechaUltimaActividad` date DEFAULT NULL,
  `fotoPerfil` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `UQ_USUARIO_correo` (`correo`),
  KEY `FK_USUARIO_ROL` (`id_rol`),
  CONSTRAINT `FK_USUARIO_ROL` FOREIGN KEY (`id_rol`) REFERENCES `ROL` (`id_rol`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USUARIO`
--

LOCK TABLES `USUARIO` WRITE;
/*!40000 ALTER TABLE `USUARIO` DISABLE KEYS */;
INSERT INTO `USUARIO` VALUES (1,'Ada Lovelace','ada@muuu.com','$2y$10$SuGfDTw3skrYVEXsW.eFp.b3ZdCK/41mMOfGaiV8CScDoyGuqla2G',1,'2026-04-22 00:29:19',1,7,'2026-04-21',NULL),(2,'Docente Muuu','docente@muuu.com','$2y$10$SuGfDTw3skrYVEXsW.eFp.b3ZdCK/41mMOfGaiV8CScDoyGuqla2G',1,'2026-04-22 00:29:19',2,0,NULL,NULL),(3,'Juan F. Barrera','jbarrera@unimagdalena.edu.co','$2y$10$SuGfDTw3skrYVEXsW.eFp.b3ZdCK/41mMOfGaiV8CScDoyGuqla2G',1,'2026-04-22 00:29:19',1,7,'2026-04-21',NULL),(4,'Sebastian Russo','srusso@unimagdalena.edu.co','$2y$10$SuGfDTw3skrYVEXsW.eFp.b3ZdCK/41mMOfGaiV8CScDoyGuqla2G',1,'2026-04-22 00:29:19',1,5,'2026-04-20',NULL),(5,'David J. Gonzalez','dgonzalez@unimagdalena.edu.co','$2y$10$SuGfDTw3skrYVEXsW.eFp.b3ZdCK/41mMOfGaiV8CScDoyGuqla2G',1,'2026-04-22 00:29:19',1,3,'2026-04-19',NULL),(6,'Carlos Perez','cperez@unimagdalena.edu.co','$2y$10$SuGfDTw3skrYVEXsW.eFp.b3ZdCK/41mMOfGaiV8CScDoyGuqla2G',1,'2026-04-22 00:29:19',2,0,NULL,NULL),(7,'Laura Gomez','lgomez@unimagdalena.edu.co','$2y$10$SuGfDTw3skrYVEXsW.eFp.b3ZdCK/41mMOfGaiV8CScDoyGuqla2G',1,'2026-04-22 00:29:19',2,0,NULL,NULL),(8,'Maria F. Rios','mrios@unimagdalena.edu.co','$2y$10$SuGfDTw3skrYVEXsW.eFp.b3ZdCK/41mMOfGaiV8CScDoyGuqla2G',1,'2026-04-22 00:29:19',1,2,'2026-04-18',NULL),(9,'Andres Suarez','asuarez@unimagdalena.edu.co','$2y$10$SuGfDTw3skrYVEXsW.eFp.b3ZdCK/41mMOfGaiV8CScDoyGuqla2G',1,'2026-04-22 00:29:19',1,1,'2026-04-17',NULL),(10,'Valentina Torres','vtorres@unimagdalena.edu.co','$2y$10$SuGfDTw3skrYVEXsW.eFp.b3ZdCK/41mMOfGaiV8CScDoyGuqla2G',1,'2026-04-22 00:29:19',1,0,'2026-04-15',NULL),(11,'deud soto','deud@muuu.com','$2y$10$kd/usf3AdTqYhl5k6GKDmu6v6mNYWd80KNCzZCw49awlXEWWXuy9S',1,'2026-04-29 00:21:24',2,0,NULL,NULL);
/*!40000 ALTER TABLE `USUARIO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USUARIO_COMPETENCIA`
--

DROP TABLE IF EXISTS `USUARIO_COMPETENCIA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USUARIO_COMPETENCIA` (
  `id_usuario` bigint NOT NULL,
  `id_competencia` bigint NOT NULL,
  `puntaje` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_usuario`,`id_competencia`),
  KEY `FK_UC_COMPETENCIA` (`id_competencia`),
  CONSTRAINT `FK_UC_COMPETENCIA` FOREIGN KEY (`id_competencia`) REFERENCES `COMPETENCIA` (`id_competencia`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_UC_USUARIO` FOREIGN KEY (`id_usuario`) REFERENCES `USUARIO` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USUARIO_COMPETENCIA`
--

LOCK TABLES `USUARIO_COMPETENCIA` WRITE;
/*!40000 ALTER TABLE `USUARIO_COMPETENCIA` DISABLE KEYS */;
INSERT INTO `USUARIO_COMPETENCIA` VALUES (3,1,450),(4,2,400),(5,1,320),(8,2,280);
/*!40000 ALTER TABLE `USUARIO_COMPETENCIA` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-30 22:14:53
