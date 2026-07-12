-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-07-2026 a las 17:12:37
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `competencias_matematicas_v2`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `id_admin` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `nombre_admin` varchar(150) NOT NULL,
  `correo_admin` varchar(200) NOT NULL,
  `password_hash_admin` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `administrador`
--

INSERT INTO `administrador` (`id_admin`, `id_rol`, `nombre_admin`, `correo_admin`, `password_hash_admin`, `created_at`, `update_at`) VALUES
(2, 1, 'Admin', 'admin@competencias.com', '$2b$12$ILnSk6XFL8Oq8eRYD/Lgyu5u6vif7FuyFNCO5X125VpdwTi5MO/oK', '2026-07-06 00:35:21', '2026-07-06 00:35:21');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carreras`
--

CREATE TABLE `carreras` (
  `id_carrera` int(11) NOT NULL,
  `nombre_carrera` varchar(200) NOT NULL,
  `descripcion` text NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `carreras`
--

INSERT INTO `carreras` (`id_carrera`, `nombre_carrera`, `descripcion`, `create_at`, `update_at`) VALUES
(1, 'Software', 'Carrera de Software', '2026-06-12 17:37:25', '2026-06-12 17:37:25'),
(2, 'Tecnología de la Información', 'Carrera de TI', '2026-06-12 17:37:25', '2026-06-12 17:37:25'),
(3, 'Ingeniería Civil', 'Carrera de Ingeniería Civil', '2026-06-12 17:37:25', '2026-06-12 17:37:25'),
(4, 'Inteligencia Artificial', 'Carrera de IA', '2026-06-12 17:37:25', '2026-06-12 17:37:25'),
(5, 'Ingeniería en Networking y Telecomunicaciones', 'Carrera de Networking', '2026-06-12 17:37:25', '2026-06-12 17:37:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudades`
--

CREATE TABLE `ciudades` (
  `id_ciudad` int(11) NOT NULL,
  `id_provincia` int(11) NOT NULL,
  `nombre_ciudad` varchar(150) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ciudades`
--

INSERT INTO `ciudades` (`id_ciudad`, `id_provincia`, `nombre_ciudad`, `create_at`, `update_at`) VALUES
(1, 1, 'Guayaquil', '2026-06-12 17:37:08', '2026-06-12 17:37:08'),
(2, 1, 'Durán', '2026-06-12 17:37:08', '2026-06-12 17:37:08'),
(3, 1, 'Samborondón', '2026-06-12 17:37:08', '2026-06-12 17:37:08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `competencias`
--

CREATE TABLE `competencias` (
  `id_competencia` int(11) NOT NULL,
  `nombre_competencia` varchar(200) NOT NULL,
  `descripcion` text NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `competencias`
--

INSERT INTO `competencias` (`id_competencia`, `nombre_competencia`, `descripcion`, `activo`, `create_at`, `update_at`) VALUES
(1, 'Razonamiento y Demostración', 'Capacidad para argumentar y demostrar procesos matemáticos', 1, '2026-06-12 17:37:47', '2026-06-12 17:37:47'),
(2, 'Comunicación y Representación', 'Interpretación y representación matemática', 1, '2026-06-12 17:37:47', '2026-06-12 17:37:47'),
(3, 'Conexiones y Modelización', 'Aplicación de modelos matemáticos', 1, '2026-06-12 17:37:47', '2026-06-12 17:37:47'),
(4, 'Resolución de Problemas', 'Capacidad para resolver problemas matemáticos', 1, '2026-06-12 17:37:47', '2026-06-12 17:37:47');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion_quiz`
--

CREATE TABLE `configuracion_quiz` (
  `id_configuracion` int(11) NOT NULL,
  `id_profesor` int(11) NOT NULL,
  `id_competencia` int(11) NOT NULL,
  `id_submodulo` int(11) NOT NULL,
  `id_tema` int(11) NOT NULL,
  `dificultad` enum('Básico','Intermedio','Avanzado') NOT NULL,
  `cantidad_preguntas` int(11) NOT NULL,
  `tiempo_minutos` int(11) NOT NULL,
  `intentos` tinyint(4) NOT NULL,
  `mezclar_preguntas` tinyint(1) NOT NULL DEFAULT 1,
  `mezclar_opciones` tinyint(1) NOT NULL DEFAULT 1,
  `mostrar_resultado` tinyint(1) NOT NULL DEFAULT 1,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `configuracion_quiz`
--

INSERT INTO `configuracion_quiz` (`id_configuracion`, `id_profesor`, `id_competencia`, `id_submodulo`, `id_tema`, `dificultad`, `cantidad_preguntas`, `tiempo_minutos`, `intentos`, `mezclar_preguntas`, `mezclar_opciones`, `mostrar_resultado`, `estado`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 1, 4, 'Básico', 10, 15, 3, 1, 1, 1, 1, '2026-07-10 02:10:32', '2026-07-10 04:46:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes`
--

CREATE TABLE `estudiantes` (
  `id_estudiante` int(11) NOT NULL,
  `nombre_estudiante` varchar(200) NOT NULL,
  `institucion_edu` varchar(200) NOT NULL,
  `id_nivel` int(11) NOT NULL,
  `id_periodo` int(11) NOT NULL,
  `id_tipo_institucion` int(11) DEFAULT NULL,
  `id_carrera` int(11) DEFAULT NULL,
  `id_ciudad` int(11) NOT NULL,
  `correo_estudiante` varchar(200) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ultimo_acceso` timestamp NULL DEFAULT NULL,
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `estudiantes`
--

INSERT INTO `estudiantes` (`id_estudiante`, `nombre_estudiante`, `institucion_edu`, `id_nivel`, `id_periodo`, `id_tipo_institucion`, `id_carrera`, `id_ciudad`, `correo_estudiante`, `password_hash`, `id_rol`, `estado`, `created_at`, `ultimo_acceso`, `update_at`) VALUES
(1, 'Juan Perez', 'Unidad Educativa ABC', 1, 1, 1, NULL, 1, 'juan@gmail.com', '$2b$12$M3WrPOAps7ScNXkrr.Hi2.7qiJei7KC8ogGw1bFUrhzOVDqEMD4fK', 3, 1, '2026-06-12 20:49:32', NULL, '2026-07-11 03:27:51'),
(2, 'Ronald Gutierrez', 'Universidad de Guayaquil', 3, 7, NULL, 1, 1, 'ronaldgutt@ug.edu.ec', '$2b$12$YB1nUSp4Ui3CzOxSCMBk6ej496W6A77mFw//EM4Voetf2pxdD.Scm', 3, 1, '2026-06-20 18:29:52', NULL, '2026-07-11 03:27:51'),
(3, 'Maria Hernandez', 'Universidad de Guayaquil', 2, 4, NULL, 1, 3, 'marihernandez@ug.edu.ec', '$2b$12$GuqtcqZ3ABMTnvuY1RgkWOKXIGKDqVADbN2YcLh1R.SDVFrDRHYaW', 3, 1, '2026-06-21 19:41:24', NULL, '2026-07-11 03:27:51'),
(4, 'Carlos Pérez', 'Universidad de Guayaquil', 2, 4, NULL, 1, 1, 'carlosperez@ug.edu.ec', '$2b$12$UYFljJZtTh3JAjzbrE7RCOAD/iCs0Yy9o4lyR8ln4vLLTmSBzis4y', 3, 1, '2026-07-01 00:41:14', NULL, '2026-07-11 03:27:51'),
(5, 'Mario Sancan', 'Universidad de Guayaquil', 2, 4, NULL, 1, 2, 'mariosan@ug.edu.ec', '$2b$12$ZvMFbhDAtfoLP9patLMgQutYVnrnq4vh.4OEWNR5Och/Ahf/q4XUK', 3, 1, '2026-07-01 02:30:40', NULL, '2026-07-11 03:27:51'),
(6, 'Juana Salazar', 'Universidad de Guayaquil', 2, 4, NULL, 1, 1, 'juanasa@ug.edu.ec', '$2b$12$FOa3loFYkOPc3HwKbKsHp.AHrG1dYFLXPnVA40aS.GHheNKaJvlXq', 3, 1, '2026-07-01 03:04:11', NULL, '2026-07-11 03:27:51'),
(7, 'Juan Mendoza', 'institucion educativo abc', 1, 2, 1, NULL, 1, 'juanmendoza@gmail.com', '$2b$12$B8LxSWcyf2.FrWVsZ/3Hzuyb3TSeUlDoKZM/a8iR5lWw.bUoF/Cuq', 3, 1, '2026-07-11 04:38:40', NULL, '2026-07-11 06:09:38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante_submodulo`
--

CREATE TABLE `estudiante_submodulo` (
  `id_estudiante_submodulo` int(11) NOT NULL,
  `id_estudiante` int(11) NOT NULL,
  `id_competencia` int(11) NOT NULL,
  `id_submodulo` int(11) NOT NULL,
  `completado` tinyint(1) DEFAULT 0,
  `fecha_completado` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `estudiante_submodulo`
--

INSERT INTO `estudiante_submodulo` (`id_estudiante_submodulo`, `id_estudiante`, `id_competencia`, `id_submodulo`, `completado`, `fecha_completado`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 1, 1, '2026-06-28 13:04:12', '2026-06-28 13:04:12', '2026-06-28 13:04:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `intentos_detalle`
--

CREATE TABLE `intentos_detalle` (
  `id_detalle` int(11) NOT NULL,
  `id_intento` int(11) NOT NULL,
  `id_pregunta` int(11) NOT NULL,
  `numero_pregunta` int(11) NOT NULL DEFAULT 1,
  `respuesta_estudiante` varchar(1) DEFAULT NULL,
  `es_correcta` tinyint(1) NOT NULL DEFAULT 0,
  `tiempo_respuesta` int(11) NOT NULL DEFAULT 0,
  `opcion_fallida` varchar(1) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `respuesta_correcta_quiz` varchar(1) DEFAULT NULL,
  `opcion_a_quiz` text DEFAULT NULL,
  `opcion_b_quiz` text DEFAULT NULL,
  `opcion_c_quiz` text DEFAULT NULL,
  `opcion_d_quiz` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `intentos_detalle`
--

INSERT INTO `intentos_detalle` (`id_detalle`, `id_intento`, `id_pregunta`, `numero_pregunta`, `respuesta_estudiante`, `es_correcta`, `tiempo_respuesta`, `opcion_fallida`, `fecha`, `respuesta_correcta_quiz`, `opcion_a_quiz`, `opcion_b_quiz`, `opcion_c_quiz`, `opcion_d_quiz`) VALUES
(12, 5, 47, 1, NULL, 0, 0, 'C', '2026-06-24 22:50:32', NULL, NULL, NULL, NULL, NULL),
(13, 5, 44, 1, NULL, 0, 0, 'C', '2026-06-24 22:50:56', NULL, NULL, NULL, NULL, NULL),
(14, 5, 44, 1, NULL, 0, 0, 'D', '2026-06-24 22:51:04', NULL, NULL, NULL, NULL, NULL),
(15, 10, 44, 1, NULL, 0, 0, 'A', '2026-06-25 03:02:04', NULL, NULL, NULL, NULL, NULL),
(17, 11, 48, 1, NULL, 0, 0, 'A', '2026-06-25 03:04:37', NULL, NULL, NULL, NULL, NULL),
(18, 11, 48, 1, NULL, 0, 0, 'B', '2026-06-25 03:05:26', NULL, NULL, NULL, NULL, NULL),
(19, 13, 47, 1, NULL, 0, 0, 'A', '2026-06-25 03:07:16', NULL, NULL, NULL, NULL, NULL),
(20, 14, 47, 1, NULL, 0, 0, 'A', '2026-06-25 03:17:43', NULL, NULL, NULL, NULL, NULL),
(21, 15, 48, 1, NULL, 0, 0, 'A', '2026-06-25 03:17:53', NULL, NULL, NULL, NULL, NULL),
(26, 22, 48, 1, NULL, 0, 0, 'A', '2026-06-25 16:38:22', NULL, NULL, NULL, NULL, NULL),
(30, 24, 50, 1, NULL, 0, 0, 'A', '2026-06-25 17:39:40', NULL, NULL, NULL, NULL, NULL),
(33, 25, 42, 1, NULL, 0, 0, 'C', '2026-06-25 18:17:14', NULL, NULL, NULL, NULL, NULL),
(40, 32, 42, 1, NULL, 0, 0, 'B', '2026-06-25 23:11:28', NULL, NULL, NULL, NULL, NULL),
(41, 32, 42, 1, NULL, 0, 0, 'D', '2026-06-25 23:11:32', NULL, NULL, NULL, NULL, NULL),
(42, 33, 44, 1, NULL, 0, 0, 'A', '2026-06-25 23:17:37', NULL, NULL, NULL, NULL, NULL),
(43, 33, 48, 1, NULL, 0, 0, 'B', '2026-06-25 23:17:47', NULL, NULL, NULL, NULL, NULL),
(44, 33, 43, 1, NULL, 0, 0, 'D', '2026-06-25 23:18:36', NULL, NULL, NULL, NULL, NULL),
(51, 37, 50, 1, 'C', 1, 85, 'A', '2026-06-26 05:45:10', NULL, NULL, NULL, NULL, NULL),
(52, 37, 45, 2, 'B', 1, 10, 'A', '2026-06-26 05:45:33', NULL, NULL, NULL, NULL, NULL),
(53, 37, 44, 3, 'B', 1, 114, NULL, '2026-06-26 05:45:40', NULL, NULL, NULL, NULL, NULL),
(54, 38, 41, 1, 'C', 1, 6, NULL, '2026-06-26 05:50:06', NULL, NULL, NULL, NULL, NULL),
(55, 40, 48, 1, 'D', 1, 19, NULL, '2026-06-26 15:03:01', NULL, NULL, NULL, NULL, NULL),
(56, 40, 43, 2, 'C', 1, 6, NULL, '2026-06-26 15:03:11', NULL, NULL, NULL, NULL, NULL),
(57, 40, 45, 3, 'B', 1, 9, NULL, '2026-06-26 15:03:19', NULL, NULL, NULL, NULL, NULL),
(58, 40, 50, 4, 'C', 1, 10, NULL, '2026-06-26 15:03:36', NULL, NULL, NULL, NULL, NULL),
(59, 40, 47, 6, 'B', 1, 5, NULL, '2026-06-26 15:03:47', NULL, NULL, NULL, NULL, NULL),
(60, 40, 49, 8, 'B', 1, 5, NULL, '2026-06-26 15:03:56', NULL, NULL, NULL, NULL, NULL),
(61, 40, 44, 9, 'B', 1, 3, NULL, '2026-06-26 15:03:59', NULL, NULL, NULL, NULL, NULL),
(62, 42, 49, 1, 'B', 1, 17, NULL, '2026-06-26 15:12:34', NULL, NULL, NULL, NULL, NULL),
(63, 42, 50, 2, 'C', 1, 7, NULL, '2026-06-26 15:12:43', NULL, NULL, NULL, NULL, NULL),
(64, 42, 44, 3, 'B', 1, 8, NULL, '2026-06-26 15:12:50', NULL, NULL, NULL, NULL, NULL),
(65, 42, 45, 4, 'B', 1, 4, NULL, '2026-06-26 15:13:00', NULL, NULL, NULL, NULL, NULL),
(66, 42, 41, 5, 'C', 1, 2, NULL, '2026-06-26 15:13:05', NULL, NULL, NULL, NULL, NULL),
(67, 42, 47, 7, 'B', 1, 12, NULL, '2026-06-26 15:13:21', NULL, NULL, NULL, NULL, NULL),
(68, 43, 48, 1, 'D', 1, 14, NULL, '2026-06-26 15:55:27', NULL, NULL, NULL, NULL, NULL),
(69, 43, 46, 3, 'A', 1, 8, NULL, '2026-06-26 15:55:47', NULL, NULL, NULL, NULL, NULL),
(70, 43, 44, 4, 'B', 1, 6, NULL, '2026-06-26 15:55:55', NULL, NULL, NULL, NULL, NULL),
(71, 43, 47, 7, 'B', 1, 7, NULL, '2026-06-26 15:56:23', NULL, NULL, NULL, NULL, NULL),
(72, 43, 45, 9, 'B', 1, 2, NULL, '2026-06-26 15:56:34', NULL, NULL, NULL, NULL, NULL),
(73, 44, 47, 2, 'B', 1, 9, NULL, '2026-06-26 15:58:50', NULL, NULL, NULL, NULL, NULL),
(74, 44, 43, 3, 'C', 1, 9, NULL, '2026-06-26 15:59:02', NULL, NULL, NULL, NULL, NULL),
(75, 44, 46, 4, 'A', 1, 7, NULL, '2026-06-26 15:59:12', NULL, NULL, NULL, NULL, NULL),
(76, 44, 48, 5, 'B', 0, 4, 'B', '2026-06-26 15:59:19', NULL, NULL, NULL, NULL, NULL),
(77, 44, 50, 6, 'B', 0, 5, 'B', '2026-06-26 15:59:25', NULL, NULL, NULL, NULL, NULL),
(78, 44, 44, 7, 'B', 1, 3, NULL, '2026-06-26 15:59:29', NULL, NULL, NULL, NULL, NULL),
(79, 44, 42, 8, 'C', 0, 5, 'C', '2026-06-26 15:59:35', NULL, NULL, NULL, NULL, NULL),
(80, 44, 49, 9, 'B', 1, 7, NULL, '2026-06-26 15:59:44', NULL, NULL, NULL, NULL, NULL),
(81, 45, 41, 1, 'C', 1, 2, NULL, '2026-06-26 19:56:03', NULL, NULL, NULL, NULL, NULL),
(82, 45, 47, 2, 'B', 1, 8, NULL, '2026-06-26 19:56:13', NULL, NULL, NULL, NULL, NULL),
(83, 45, 50, 3, 'C', 1, 4, NULL, '2026-06-26 19:56:18', NULL, NULL, NULL, NULL, NULL),
(84, 45, 43, 4, 'C', 1, 4, NULL, '2026-06-26 19:56:23', NULL, NULL, NULL, NULL, NULL),
(85, 45, 42, 5, 'A', 1, 12, NULL, '2026-06-26 19:56:36', NULL, NULL, NULL, NULL, NULL),
(86, 45, 48, 6, 'D', 1, 4, NULL, '2026-06-26 19:56:42', NULL, NULL, NULL, NULL, NULL),
(87, 45, 44, 7, 'B', 1, 9, NULL, '2026-06-26 19:56:53', NULL, NULL, NULL, NULL, NULL),
(88, 45, 45, 8, 'B', 1, 3, NULL, '2026-06-26 19:56:57', NULL, NULL, NULL, NULL, NULL),
(89, 45, 46, 9, 'A', 1, 5, NULL, '2026-06-26 19:57:04', NULL, NULL, NULL, NULL, NULL),
(90, 45, 49, 10, 'B', 1, 8, NULL, '2026-06-26 19:57:13', NULL, NULL, NULL, NULL, NULL),
(91, 46, 41, 1, 'C', 1, 122, NULL, '2026-06-26 20:01:27', NULL, NULL, NULL, NULL, NULL),
(92, 46, 43, 2, 'C', 1, 11, NULL, '2026-06-26 20:01:40', NULL, NULL, NULL, NULL, NULL),
(93, 46, 48, 3, 'A', 0, 5, 'A', '2026-06-26 20:01:53', NULL, NULL, NULL, NULL, NULL),
(94, 46, 42, 4, 'B', 0, 3, 'B', '2026-06-26 20:02:05', NULL, NULL, NULL, NULL, NULL),
(95, 46, 45, 5, 'D', 0, 4, 'D', '2026-06-26 20:02:10', NULL, NULL, NULL, NULL, NULL),
(96, 46, 49, 6, 'B', 1, 4, NULL, '2026-06-26 20:02:15', NULL, NULL, NULL, NULL, NULL),
(97, 46, 46, 7, 'A', 1, 5, NULL, '2026-06-26 20:02:24', NULL, NULL, NULL, NULL, NULL),
(98, 46, 47, 8, 'C', 0, 5, 'C', '2026-06-26 20:02:30', NULL, NULL, NULL, NULL, NULL),
(99, 46, 50, 9, 'C', 1, 5, NULL, '2026-06-26 20:02:37', NULL, NULL, NULL, NULL, NULL),
(100, 46, 44, 10, 'B', 1, 11, NULL, '2026-06-26 20:02:50', NULL, NULL, NULL, NULL, NULL),
(101, 47, 50, 1, 'X', 0, 5, NULL, '2026-06-26 20:20:50', NULL, NULL, NULL, NULL, NULL),
(102, 47, 43, 2, 'X', 0, 6, NULL, '2026-06-26 20:21:01', NULL, NULL, NULL, NULL, NULL),
(103, 47, 48, 3, 'D', 1, 7, NULL, '2026-06-26 20:21:09', NULL, NULL, NULL, NULL, NULL),
(104, 47, 44, 4, 'B', 1, 3, NULL, '2026-06-26 20:21:14', NULL, NULL, NULL, NULL, NULL),
(105, 47, 42, 5, 'A', 1, 5, NULL, '2026-06-26 20:21:18', NULL, NULL, NULL, NULL, NULL),
(106, 47, 41, 6, 'C', 1, 8, NULL, '2026-06-26 20:21:37', NULL, NULL, NULL, NULL, NULL),
(107, 47, 49, 7, 'X', 0, 7, NULL, '2026-06-26 20:21:49', NULL, NULL, NULL, NULL, NULL),
(108, 47, 45, 8, 'B', 1, 6, NULL, '2026-06-26 20:21:55', NULL, NULL, NULL, NULL, NULL),
(109, 47, 47, 9, 'C', 0, 5, 'C', '2026-06-26 20:22:02', NULL, NULL, NULL, NULL, NULL),
(110, 47, 46, 10, 'A', 1, 3, NULL, '2026-06-26 20:22:06', NULL, NULL, NULL, NULL, NULL),
(111, 48, 50, 1, 'C', 1, 6, NULL, '2026-06-26 20:49:25', NULL, NULL, NULL, NULL, NULL),
(112, 48, 49, 2, 'B', 1, 8, NULL, '2026-06-26 20:49:34', NULL, NULL, NULL, NULL, NULL),
(113, 48, 48, 3, 'D', 1, 9, NULL, '2026-06-26 20:49:49', NULL, NULL, NULL, NULL, NULL),
(114, 48, 47, 4, 'B', 1, 3, NULL, '2026-06-26 20:49:53', NULL, NULL, NULL, NULL, NULL),
(115, 48, 46, 5, 'X', 0, 6, NULL, '2026-06-26 20:50:01', NULL, NULL, NULL, NULL, NULL),
(116, 48, 43, 6, 'C', 1, 3, NULL, '2026-06-26 20:50:06', NULL, NULL, NULL, NULL, NULL),
(117, 48, 44, 7, 'B', 1, 2, NULL, '2026-06-26 20:50:09', NULL, NULL, NULL, NULL, NULL),
(118, 48, 42, 8, 'X', 0, 5, NULL, '2026-06-26 20:50:17', NULL, NULL, NULL, NULL, NULL),
(119, 48, 45, 9, 'B', 1, 2, NULL, '2026-06-26 20:50:20', NULL, NULL, NULL, NULL, NULL),
(120, 48, 41, 10, 'C', 1, 2, NULL, '2026-06-26 20:50:24', NULL, NULL, NULL, NULL, NULL),
(121, 49, 41, 1, 'C', 1, 5, NULL, '2026-06-26 22:44:36', NULL, NULL, NULL, NULL, NULL),
(122, 49, 44, 2, 'B', 1, 3, NULL, '2026-06-26 22:44:41', NULL, NULL, NULL, NULL, NULL),
(123, 49, 43, 3, 'C', 1, 2, NULL, '2026-06-26 22:44:44', NULL, NULL, NULL, NULL, NULL),
(124, 49, 42, 4, 'A', 1, 3, NULL, '2026-06-26 22:44:49', NULL, NULL, NULL, NULL, NULL),
(125, 49, 50, 5, 'C', 1, 3, NULL, '2026-06-26 22:44:53', NULL, NULL, NULL, NULL, NULL),
(126, 49, 47, 6, 'B', 1, 4, NULL, '2026-06-26 22:44:59', NULL, NULL, NULL, NULL, NULL),
(127, 49, 46, 7, 'A', 1, 3, NULL, '2026-06-26 22:45:06', NULL, NULL, NULL, NULL, NULL),
(128, 49, 49, 8, 'B', 1, 7, NULL, '2026-06-26 22:45:14', NULL, NULL, NULL, NULL, NULL),
(129, 49, 48, 9, 'D', 1, 9, NULL, '2026-06-26 22:45:27', NULL, NULL, NULL, NULL, NULL),
(130, 49, 45, 10, 'B', 1, 5, NULL, '2026-06-26 22:45:34', NULL, NULL, NULL, NULL, NULL),
(131, 50, 50, 1, 'C', 1, 2, NULL, '2026-06-26 23:05:31', NULL, NULL, NULL, NULL, NULL),
(132, 50, 42, 2, 'A', 1, 5, NULL, '2026-06-26 23:05:36', NULL, NULL, NULL, NULL, NULL),
(133, 50, 49, 3, 'B', 1, 2, NULL, '2026-06-26 23:05:39', NULL, NULL, NULL, NULL, NULL),
(134, 50, 41, 4, 'C', 1, 3, NULL, '2026-06-26 23:05:44', NULL, NULL, NULL, NULL, NULL),
(135, 50, 47, 5, 'B', 1, 3, NULL, '2026-06-26 23:05:48', NULL, NULL, NULL, NULL, NULL),
(136, 50, 45, 6, 'B', 1, 2, NULL, '2026-06-26 23:05:51', NULL, NULL, NULL, NULL, NULL),
(137, 50, 48, 7, 'D', 1, 4, NULL, '2026-06-26 23:05:55', NULL, NULL, NULL, NULL, NULL),
(138, 50, 46, 8, 'A', 1, 3, NULL, '2026-06-26 23:06:00', NULL, NULL, NULL, NULL, NULL),
(139, 50, 44, 9, 'B', 1, 3, NULL, '2026-06-26 23:06:04', NULL, NULL, NULL, NULL, NULL),
(140, 50, 43, 10, 'C', 1, 2, NULL, '2026-06-26 23:06:08', NULL, NULL, NULL, NULL, NULL),
(141, 51, 43, 1, 'X', 0, 6, NULL, '2026-06-27 04:19:54', NULL, NULL, NULL, NULL, NULL),
(142, 51, 49, 2, 'B', 1, 3, NULL, '2026-06-27 04:19:59', NULL, NULL, NULL, NULL, NULL),
(143, 51, 46, 3, 'A', 1, 5, NULL, '2026-06-27 04:20:02', NULL, NULL, NULL, NULL, NULL),
(144, 51, 48, 4, 'D', 1, 9, NULL, '2026-06-27 04:20:13', NULL, NULL, NULL, NULL, NULL),
(145, 51, 50, 5, 'C', 1, 3, NULL, '2026-06-27 04:20:21', NULL, NULL, NULL, NULL, NULL),
(146, 51, 41, 6, 'X', 0, 5, NULL, '2026-06-27 04:20:29', NULL, NULL, NULL, NULL, NULL),
(147, 51, 45, 7, 'B', 1, 3, NULL, '2026-06-27 04:20:34', NULL, NULL, NULL, NULL, NULL),
(148, 51, 47, 8, 'B', 1, 4, NULL, '2026-06-27 04:20:40', NULL, NULL, NULL, NULL, NULL),
(149, 51, 42, 9, 'X', 0, 4, NULL, '2026-06-27 04:20:45', NULL, NULL, NULL, NULL, NULL),
(150, 51, 44, 10, 'B', 1, 2, NULL, '2026-06-27 04:20:49', NULL, NULL, NULL, NULL, NULL),
(151, 52, 43, 1, 'C', 1, 2, NULL, '2026-06-27 04:59:23', NULL, NULL, NULL, NULL, NULL),
(152, 52, 45, 2, 'B', 1, 4, NULL, '2026-06-27 04:59:26', NULL, NULL, NULL, NULL, NULL),
(153, 52, 49, 3, 'B', 1, 1, NULL, '2026-06-27 04:59:31', NULL, NULL, NULL, NULL, NULL),
(154, 52, 47, 4, 'X', 0, 5, NULL, '2026-06-27 04:59:38', NULL, NULL, NULL, NULL, NULL),
(155, 52, 48, 5, 'D', 1, 7, NULL, '2026-06-27 04:59:43', NULL, NULL, NULL, NULL, NULL),
(156, 52, 42, 6, 'X', 0, 5, NULL, '2026-06-27 04:59:52', NULL, NULL, NULL, NULL, NULL),
(157, 52, 44, 7, 'B', 1, 2, NULL, '2026-06-27 04:59:56', NULL, NULL, NULL, NULL, NULL),
(158, 52, 41, 8, 'X', 0, 5, NULL, '2026-06-27 05:00:01', NULL, NULL, NULL, NULL, NULL),
(159, 52, 46, 9, 'A', 1, 3, NULL, '2026-06-27 05:00:05', NULL, NULL, NULL, NULL, NULL),
(160, 52, 50, 10, 'C', 1, 2, NULL, '2026-06-27 05:00:08', NULL, NULL, NULL, NULL, NULL),
(161, 53, 57, 1, 'C', 1, 9, NULL, '2026-06-27 05:50:13', NULL, NULL, NULL, NULL, NULL),
(162, 53, 60, 2, 'C', 1, 33, NULL, '2026-06-27 05:50:25', NULL, NULL, NULL, NULL, NULL),
(163, 53, 54, 3, 'X', 0, 8, NULL, '2026-06-27 05:50:58', NULL, NULL, NULL, NULL, NULL),
(164, 53, 56, 4, 'A', 1, 13, NULL, '2026-06-27 05:51:14', NULL, NULL, NULL, NULL, NULL),
(165, 53, 51, 5, 'B', 1, 8, NULL, '2026-06-27 05:51:24', NULL, NULL, NULL, NULL, NULL),
(166, 53, 52, 6, 'C', 1, 3, NULL, '2026-06-27 05:51:28', NULL, NULL, NULL, NULL, NULL),
(167, 53, 53, 7, 'X', 0, 8, NULL, '2026-06-27 05:51:38', NULL, NULL, NULL, NULL, NULL),
(168, 53, 58, 8, 'C', 1, 10, NULL, '2026-06-27 05:51:49', NULL, NULL, NULL, NULL, NULL),
(169, 53, 59, 9, 'B', 1, 10, NULL, '2026-06-27 05:52:00', NULL, NULL, NULL, NULL, NULL),
(170, 53, 55, 10, 'C', 1, 10, NULL, '2026-06-27 05:52:11', NULL, NULL, NULL, NULL, NULL),
(171, 54, 43, 1, 'C', 1, 95, NULL, '2026-06-28 02:27:30', NULL, NULL, NULL, NULL, NULL),
(172, 54, 48, 2, 'X', 0, 8, NULL, '2026-06-28 02:27:51', NULL, NULL, NULL, NULL, NULL),
(173, 54, 46, 3, 'A', 1, 5, NULL, '2026-06-28 02:28:04', NULL, NULL, NULL, NULL, NULL),
(174, 54, 49, 4, 'B', 1, 7, NULL, '2026-06-28 02:28:10', NULL, NULL, NULL, NULL, NULL),
(175, 54, 44, 5, 'B', 1, 7, NULL, '2026-06-28 02:28:17', NULL, NULL, NULL, NULL, NULL),
(176, 54, 41, 6, 'C', 1, 21, NULL, '2026-06-28 02:28:42', NULL, NULL, NULL, NULL, NULL),
(177, 54, 45, 7, 'C', 0, 8, 'C', '2026-06-28 02:28:52', NULL, NULL, NULL, NULL, NULL),
(178, 54, 42, 8, 'B', 0, 3, 'B', '2026-06-28 02:28:56', NULL, NULL, NULL, NULL, NULL),
(179, 54, 47, 9, 'B', 1, 4, NULL, '2026-06-28 02:29:01', NULL, NULL, NULL, NULL, NULL),
(180, 54, 50, 10, 'A', 0, 4, 'A', '2026-06-28 02:29:05', NULL, NULL, NULL, NULL, NULL),
(181, 55, 43, 1, 'C', 1, 3, NULL, '2026-06-28 17:50:30', NULL, NULL, NULL, NULL, NULL),
(182, 55, 45, 2, 'B', 1, 2, NULL, '2026-06-28 17:50:33', NULL, NULL, NULL, NULL, NULL),
(183, 55, 46, 3, 'X', 0, 2, NULL, '2026-06-28 17:50:36', NULL, NULL, NULL, NULL, NULL),
(184, 55, 42, 4, 'A', 1, 3, NULL, '2026-06-28 17:50:40', NULL, NULL, NULL, NULL, NULL),
(185, 55, 49, 5, 'B', 1, 2, NULL, '2026-06-28 17:50:43', NULL, NULL, NULL, NULL, NULL),
(186, 55, 44, 6, 'B', 1, 6, NULL, '2026-06-28 17:50:50', NULL, NULL, NULL, NULL, NULL),
(187, 55, 48, 7, 'D', 1, 5, NULL, '2026-06-28 17:50:56', NULL, NULL, NULL, NULL, NULL),
(188, 55, 50, 8, 'C', 1, 2, NULL, '2026-06-28 17:50:59', NULL, NULL, NULL, NULL, NULL),
(189, 55, 41, 9, 'C', 1, 4, NULL, '2026-06-28 17:51:04', NULL, NULL, NULL, NULL, NULL),
(190, 55, 47, 10, 'B', 1, 6, NULL, '2026-06-28 17:51:11', NULL, NULL, NULL, NULL, NULL),
(191, 56, 43, 1, 'C', 1, 2, NULL, '2026-06-28 18:03:22', NULL, NULL, NULL, NULL, NULL),
(192, 56, 50, 2, 'C', 1, 3, NULL, '2026-06-28 18:03:26', NULL, NULL, NULL, NULL, NULL),
(193, 56, 45, 3, 'B', 1, 2, NULL, '2026-06-28 18:03:28', NULL, NULL, NULL, NULL, NULL),
(194, 56, 44, 4, 'B', 1, 2, NULL, '2026-06-28 18:03:33', NULL, NULL, NULL, NULL, NULL),
(195, 56, 48, 5, 'D', 1, 3, NULL, '2026-06-28 18:03:37', NULL, NULL, NULL, NULL, NULL),
(196, 56, 41, 6, 'C', 1, 3, NULL, '2026-06-28 18:03:41', NULL, NULL, NULL, NULL, NULL),
(197, 56, 47, 7, 'B', 1, 3, NULL, '2026-06-28 18:03:46', NULL, NULL, NULL, NULL, NULL),
(198, 56, 46, 8, 'A', 1, 5, NULL, '2026-06-28 18:03:53', NULL, NULL, NULL, NULL, NULL),
(199, 56, 42, 9, 'A', 1, 10, NULL, '2026-06-28 18:04:04', NULL, NULL, NULL, NULL, NULL),
(200, 56, 49, 10, 'B', 1, 4, NULL, '2026-06-28 18:04:09', NULL, NULL, NULL, NULL, NULL),
(201, 57, 46, 1, 'A', 1, 2, NULL, '2026-06-28 20:46:45', NULL, NULL, NULL, NULL, NULL),
(202, 57, 49, 2, 'B', 1, 2, NULL, '2026-06-28 20:46:47', NULL, NULL, NULL, NULL, NULL),
(203, 57, 43, 3, 'C', 1, 1, NULL, '2026-06-28 20:46:50', NULL, NULL, NULL, NULL, NULL),
(204, 57, 44, 4, 'B', 1, 2, NULL, '2026-06-28 20:46:53', NULL, NULL, NULL, NULL, NULL),
(205, 57, 42, 5, 'A', 1, 3, NULL, '2026-06-28 20:46:56', NULL, NULL, NULL, NULL, NULL),
(206, 57, 45, 6, 'B', 1, 2, NULL, '2026-06-28 20:46:59', NULL, NULL, NULL, NULL, NULL),
(207, 57, 47, 7, 'B', 1, 5, NULL, '2026-06-28 20:47:05', NULL, NULL, NULL, NULL, NULL),
(208, 57, 41, 8, 'C', 1, 2, NULL, '2026-06-28 20:47:09', NULL, NULL, NULL, NULL, NULL),
(209, 57, 50, 9, 'C', 1, 2, NULL, '2026-06-28 20:47:12', NULL, NULL, NULL, NULL, NULL),
(210, 57, 48, 10, 'D', 1, 3, NULL, '2026-06-28 20:47:15', NULL, NULL, NULL, NULL, NULL),
(211, 58, 54, 1, 'C', 1, 8, NULL, '2026-06-29 23:07:45', NULL, NULL, NULL, NULL, NULL),
(212, 58, 60, 2, 'C', 1, 17, NULL, '2026-06-29 23:07:57', NULL, NULL, NULL, NULL, NULL),
(213, 58, 55, 3, 'C', 1, 8, NULL, '2026-06-29 23:08:12', NULL, NULL, NULL, NULL, NULL),
(214, 58, 58, 4, 'C', 1, 12, NULL, '2026-06-29 23:08:25', NULL, NULL, NULL, NULL, NULL),
(215, 58, 57, 5, 'C', 1, 16, NULL, '2026-06-29 23:08:41', NULL, NULL, NULL, NULL, NULL),
(216, 58, 52, 6, 'A', 0, 3, 'A', '2026-06-29 23:08:46', NULL, NULL, NULL, NULL, NULL),
(217, 58, 53, 7, 'B', 0, 5, 'B', '2026-06-29 23:08:53', NULL, NULL, NULL, NULL, NULL),
(218, 58, 56, 8, 'C', 0, 7, 'C', '2026-06-29 23:09:02', NULL, NULL, NULL, NULL, NULL),
(219, 58, 51, 9, 'B', 1, 13, NULL, '2026-06-29 23:09:20', NULL, NULL, NULL, NULL, NULL),
(220, 58, 59, 10, 'B', 1, 7, NULL, '2026-06-29 23:09:28', NULL, NULL, NULL, NULL, NULL),
(221, 59, 47, 1, 'B', 1, 22, NULL, '2026-07-03 23:14:31', NULL, NULL, NULL, NULL, NULL),
(222, 59, 45, 2, 'B', 1, 29, NULL, '2026-07-03 23:14:47', NULL, NULL, NULL, NULL, NULL),
(223, 59, 41, 3, 'C', 1, 4, NULL, '2026-07-03 23:15:07', NULL, NULL, NULL, NULL, NULL),
(224, 59, 42, 4, 'X', 0, 4, NULL, '2026-07-03 23:15:12', NULL, NULL, NULL, NULL, NULL),
(225, 59, 50, 5, 'C', 1, 3, NULL, '2026-07-03 23:15:29', NULL, NULL, NULL, NULL, NULL),
(226, 59, 43, 6, 'C', 1, 3, NULL, '2026-07-03 23:15:33', NULL, NULL, NULL, NULL, NULL),
(227, 59, 49, 7, 'B', 1, 3, NULL, '2026-07-03 23:15:37', NULL, NULL, NULL, NULL, NULL),
(228, 59, 46, 8, 'A', 1, 5, NULL, '2026-07-03 23:15:41', NULL, NULL, NULL, NULL, NULL),
(229, 59, 48, 9, 'B', 0, 6, 'B', '2026-07-03 23:15:50', NULL, NULL, NULL, NULL, NULL),
(230, 59, 44, 10, 'B', 1, 3, NULL, '2026-07-03 23:16:03', NULL, NULL, NULL, NULL, NULL),
(231, 60, 41, 1, 'C', 1, 63, NULL, '2026-07-06 04:54:19', NULL, NULL, NULL, NULL, NULL),
(232, 60, 43, 2, 'X', 0, 7, NULL, '2026-07-06 04:54:45', NULL, NULL, NULL, NULL, NULL),
(233, 60, 50, 3, 'C', 1, 8, NULL, '2026-07-06 04:55:01', NULL, NULL, NULL, NULL, NULL),
(234, 60, 45, 4, 'C', 0, 11, 'C', '2026-07-06 04:55:09', NULL, NULL, NULL, NULL, NULL),
(235, 60, 42, 5, 'A', 1, 4, NULL, '2026-07-06 04:55:37', NULL, NULL, NULL, NULL, NULL),
(236, 60, 47, 6, 'B', 1, 3, NULL, '2026-07-06 04:55:41', NULL, NULL, NULL, NULL, NULL),
(237, 60, 48, 7, 'A', 0, 1, 'A', '2026-07-06 04:55:44', NULL, NULL, NULL, NULL, NULL),
(238, 60, 46, 8, 'B', 0, 2, 'B', '2026-07-06 04:55:46', NULL, NULL, NULL, NULL, NULL),
(239, 60, 44, 9, 'B', 1, 4, NULL, '2026-07-06 04:55:51', NULL, NULL, NULL, NULL, NULL),
(240, 60, 49, 10, 'B', 1, 3, NULL, '2026-07-06 04:55:56', NULL, NULL, NULL, NULL, NULL),
(241, 61, 41, 1, 'C', 1, 52, NULL, '2026-07-07 03:18:51', NULL, NULL, NULL, NULL, NULL),
(242, 61, 44, 2, 'B', 1, 5, NULL, '2026-07-07 03:19:36', NULL, NULL, NULL, NULL, NULL),
(243, 61, 42, 3, 'A', 1, 9, NULL, '2026-07-07 03:19:39', NULL, NULL, NULL, NULL, NULL),
(244, 61, 47, 4, 'B', 1, 7, NULL, '2026-07-07 03:19:51', NULL, NULL, NULL, NULL, NULL),
(245, 61, 49, 5, 'C', 0, 8, 'C', '2026-07-07 03:20:04', NULL, NULL, NULL, NULL, NULL),
(246, 61, 43, 6, 'C', 1, 9, NULL, '2026-07-07 03:20:30', NULL, NULL, NULL, NULL, NULL),
(247, 61, 50, 7, 'C', 1, 2, NULL, '2026-07-07 03:20:33', NULL, NULL, NULL, NULL, NULL),
(248, 61, 45, 8, 'B', 1, 2, NULL, '2026-07-07 03:20:36', NULL, NULL, NULL, NULL, NULL),
(249, 61, 48, 9, 'C', 0, 5, 'C', '2026-07-07 03:20:42', NULL, NULL, NULL, NULL, NULL),
(250, 61, 46, 10, 'B', 0, 5, 'B', '2026-07-07 03:20:47', NULL, NULL, NULL, NULL, NULL),
(251, 62, 45, 1, 'B', 1, 62, NULL, '2026-07-07 14:49:36', NULL, NULL, NULL, NULL, NULL),
(252, 62, 49, 2, 'B', 1, 4, NULL, '2026-07-07 14:49:54', NULL, NULL, NULL, NULL, NULL),
(253, 62, 41, 3, 'C', 1, 2, NULL, '2026-07-07 14:49:58', NULL, NULL, NULL, NULL, NULL),
(254, 62, 46, 4, 'A', 1, 196, NULL, '2026-07-07 14:52:29', NULL, NULL, NULL, NULL, NULL),
(255, 62, 44, 5, 'B', 1, 38, NULL, '2026-07-07 14:53:55', NULL, NULL, NULL, NULL, NULL),
(256, 62, 42, 6, 'B', 0, 10, 'B', '2026-07-07 14:54:07', NULL, NULL, NULL, NULL, NULL),
(257, 62, 47, 7, 'C', 0, 3, 'C', '2026-07-07 14:54:46', NULL, NULL, NULL, NULL, NULL),
(258, 62, 48, 8, 'C', 0, 2, 'C', '2026-07-07 14:54:49', NULL, NULL, NULL, NULL, NULL),
(259, 62, 43, 9, 'C', 1, 3, NULL, '2026-07-07 14:54:52', NULL, NULL, NULL, NULL, NULL),
(260, 62, 50, 10, 'C', 1, 3, NULL, '2026-07-07 14:54:56', NULL, NULL, NULL, NULL, NULL),
(261, 63, 50, 1, 'C', 1, 48, NULL, '2026-07-07 16:53:59', NULL, NULL, NULL, NULL, NULL),
(262, 63, 42, 2, 'X', 0, 10, NULL, '2026-07-07 16:54:50', NULL, NULL, NULL, NULL, NULL),
(263, 63, 49, 3, 'B', 1, 3, NULL, '2026-07-07 16:54:54', NULL, NULL, NULL, NULL, NULL),
(264, 63, 44, 4, 'B', 1, 2, NULL, '2026-07-07 16:54:57', NULL, NULL, NULL, NULL, NULL),
(265, 63, 43, 5, 'C', 1, 4, NULL, '2026-07-07 16:55:00', NULL, NULL, NULL, NULL, NULL),
(266, 63, 47, 6, 'B', 1, 16, NULL, '2026-07-07 16:55:19', NULL, NULL, NULL, NULL, NULL),
(267, 63, 41, 7, 'C', 1, 2, NULL, '2026-07-07 16:55:22', NULL, NULL, NULL, NULL, NULL),
(268, 63, 46, 8, 'A', 1, 5, NULL, '2026-07-07 16:55:26', NULL, NULL, NULL, NULL, NULL),
(269, 63, 45, 9, 'B', 1, 2, NULL, '2026-07-07 16:55:31', NULL, NULL, NULL, NULL, NULL),
(270, 63, 48, 10, 'C', 0, 3, 'C', '2026-07-07 16:55:34', NULL, NULL, NULL, NULL, NULL),
(271, 64, 41, 1, 'C', 1, 6, NULL, '2026-07-07 20:52:16', NULL, NULL, NULL, NULL, NULL),
(272, 64, 45, 2, 'B', 1, 2, NULL, '2026-07-07 20:52:21', NULL, NULL, NULL, NULL, NULL),
(273, 64, 43, 3, 'C', 1, 2, NULL, '2026-07-07 20:52:24', NULL, NULL, NULL, NULL, NULL),
(274, 64, 42, 4, 'C', 0, 3, 'C', '2026-07-07 20:52:29', NULL, NULL, NULL, NULL, NULL),
(275, 64, 46, 5, 'A', 1, 3, NULL, '2026-07-07 20:52:37', NULL, NULL, NULL, NULL, NULL),
(276, 64, 47, 6, 'B', 1, 2, NULL, '2026-07-07 20:52:41', NULL, NULL, NULL, NULL, NULL),
(277, 64, 44, 7, 'B', 1, 5, NULL, '2026-07-07 20:52:44', NULL, NULL, NULL, NULL, NULL),
(278, 64, 48, 8, 'C', 0, 2, 'C', '2026-07-07 20:52:49', NULL, NULL, NULL, NULL, NULL),
(279, 64, 49, 9, 'B', 1, 2, NULL, '2026-07-07 20:52:52', NULL, NULL, NULL, NULL, NULL),
(280, 64, 50, 10, 'C', 1, 2, NULL, '2026-07-07 20:52:56', NULL, NULL, NULL, NULL, NULL),
(281, 65, 63, 1, 'A', 1, 14, NULL, '2026-07-07 21:18:06', NULL, NULL, NULL, NULL, NULL),
(282, 65, 65, 2, 'D', 0, 15, 'D', '2026-07-07 21:18:25', NULL, NULL, NULL, NULL, NULL),
(283, 65, 70, 3, 'C', 1, 9, NULL, '2026-07-07 21:18:39', NULL, NULL, NULL, NULL, NULL),
(284, 65, 64, 4, 'C', 0, 11, 'C', '2026-07-07 21:18:54', NULL, NULL, NULL, NULL, NULL),
(285, 65, 66, 5, 'C', 0, 5, 'C', '2026-07-07 21:19:01', NULL, NULL, NULL, NULL, NULL),
(286, 65, 62, 6, 'B', 0, 8, 'B', '2026-07-07 21:19:11', NULL, NULL, NULL, NULL, NULL),
(287, 65, 68, 7, 'C', 1, 7, NULL, '2026-07-07 21:19:19', NULL, NULL, NULL, NULL, NULL),
(288, 65, 67, 8, 'A', 1, 24, NULL, '2026-07-07 21:19:44', NULL, NULL, NULL, NULL, NULL),
(289, 65, 69, 9, 'B', 1, 10, NULL, '2026-07-07 21:19:56', NULL, NULL, NULL, NULL, NULL),
(290, 65, 61, 10, 'B', 1, 14, NULL, '2026-07-07 21:20:12', NULL, NULL, NULL, NULL, NULL),
(291, 66, 41, 1, '-', 0, 0, NULL, '2026-07-10 20:34:43', 'B', NULL, NULL, NULL, NULL),
(292, 66, 42, 2, '-', 0, 0, NULL, '2026-07-10 20:34:43', 'B', NULL, NULL, NULL, NULL),
(293, 66, 49, 3, '-', 0, 0, NULL, '2026-07-10 20:34:43', 'D', NULL, NULL, NULL, NULL),
(294, 66, 43, 4, '-', 0, 0, NULL, '2026-07-10 20:34:43', 'A', NULL, NULL, NULL, NULL),
(295, 66, 47, 5, '-', 0, 0, NULL, '2026-07-10 20:34:43', 'D', NULL, NULL, NULL, NULL),
(296, 66, 44, 6, '-', 0, 0, NULL, '2026-07-10 20:34:43', 'D', NULL, NULL, NULL, NULL),
(297, 66, 46, 7, '-', 0, 0, NULL, '2026-07-10 20:34:43', 'C', NULL, NULL, NULL, NULL),
(298, 66, 50, 8, '-', 0, 0, NULL, '2026-07-10 20:34:43', 'D', NULL, NULL, NULL, NULL),
(299, 66, 45, 9, '-', 0, 0, NULL, '2026-07-10 20:34:43', 'C', NULL, NULL, NULL, NULL),
(300, 66, 48, 10, '-', 0, 0, NULL, '2026-07-10 20:34:43', 'A', NULL, NULL, NULL, NULL),
(301, 67, 41, 1, 'B', 1, 88, NULL, '2026-07-10 21:21:38', 'B', NULL, NULL, NULL, NULL),
(302, 67, 46, 2, 'A', 1, 3, NULL, '2026-07-10 21:21:38', 'A', NULL, NULL, NULL, NULL),
(303, 67, 44, 3, 'D', 1, 54, NULL, '2026-07-10 21:21:38', 'D', NULL, NULL, NULL, NULL),
(304, 67, 48, 4, 'B', 0, 19, 'B', '2026-07-10 21:21:38', 'A', NULL, NULL, NULL, NULL),
(305, 67, 43, 5, '-', 0, 0, NULL, '2026-07-10 21:21:38', 'D', NULL, NULL, NULL, NULL),
(306, 67, 45, 6, '-', 0, 0, NULL, '2026-07-10 21:21:38', 'C', NULL, NULL, NULL, NULL),
(307, 67, 42, 7, '-', 0, 0, NULL, '2026-07-10 21:21:38', 'C', NULL, NULL, NULL, NULL),
(308, 67, 49, 8, 'C', 1, 4, NULL, '2026-07-10 21:21:38', 'C', NULL, NULL, NULL, NULL),
(309, 67, 50, 9, '-', 0, 0, NULL, '2026-07-10 21:21:38', 'C', NULL, NULL, NULL, NULL),
(310, 67, 47, 10, 'D', 1, 3, NULL, '2026-07-10 21:21:38', 'D', NULL, NULL, NULL, NULL),
(311, 68, 41, 1, 'A', 1, 17, NULL, '2026-07-10 21:38:38', 'A', NULL, NULL, NULL, NULL),
(312, 68, 45, 2, 'C', 1, 11, NULL, '2026-07-10 21:38:38', 'C', NULL, NULL, NULL, NULL),
(313, 68, 47, 3, 'D', 1, 7, NULL, '2026-07-10 21:38:38', 'D', NULL, NULL, NULL, NULL),
(314, 68, 46, 4, 'D', 1, 3, NULL, '2026-07-10 21:38:38', 'D', NULL, NULL, NULL, NULL),
(315, 68, 43, 5, 'B', 1, 2, NULL, '2026-07-10 21:38:38', 'B', NULL, NULL, NULL, NULL),
(316, 68, 44, 6, 'A', 1, 3, NULL, '2026-07-10 21:38:38', 'A', NULL, NULL, NULL, NULL),
(317, 68, 42, 7, 'D', 1, 8, NULL, '2026-07-10 21:38:38', 'D', NULL, NULL, NULL, NULL),
(318, 68, 49, 8, 'D', 1, 7, NULL, '2026-07-10 21:38:38', 'D', NULL, NULL, NULL, NULL),
(319, 68, 50, 9, 'B', 1, 3, NULL, '2026-07-10 21:38:38', 'B', NULL, NULL, NULL, NULL),
(320, 68, 48, 10, 'D', 1, 4, NULL, '2026-07-10 21:38:38', 'D', NULL, NULL, NULL, NULL),
(321, 70, 41, 1, '-', 0, 0, NULL, '2026-07-10 23:52:12', 'A', '13', '11', '14', '12'),
(322, 70, 45, 2, '-', 0, 0, NULL, '2026-07-10 23:52:12', 'A', '2x', '3x', 'x²', 'x'),
(323, 70, 48, 3, '-', 0, 0, NULL, '2026-07-10 23:52:12', 'C', '5', '8', '9', '7'),
(324, 70, 43, 4, '-', 0, 0, NULL, '2026-07-10 23:52:12', 'B', '22', '24', '26', '20'),
(325, 70, 50, 5, '-', 0, 0, NULL, '2026-07-10 23:52:12', 'A', '49', '14', '28', '56'),
(326, 70, 47, 6, '-', 0, 0, NULL, '2026-07-10 23:52:12', 'D', '6', '5', '3', '4'),
(327, 70, 46, 7, '-', 0, 0, NULL, '2026-07-10 23:52:12', 'D', '5a²', '6a', 'a²', '5a'),
(328, 70, 42, 8, '-', 0, 0, NULL, '2026-07-10 23:52:12', 'A', '8', '7', '6', '9'),
(329, 70, 44, 9, '-', 0, 0, NULL, '2026-07-10 23:52:12', 'C', '6', '5', '4', '3'),
(330, 70, 49, 10, '-', 0, 0, NULL, '2026-07-10 23:52:12', 'B', 'x+3', '2x+6', '2x+3', 'x+6'),
(331, 71, 46, 1, '-', 0, 0, NULL, '2026-07-10 23:53:45', 'C', '6a', '5a²', '5a', 'a²'),
(332, 71, 49, 2, '-', 0, 0, NULL, '2026-07-10 23:53:45', 'D', '2x+3', 'x+3', 'x+6', '2x+6'),
(333, 71, 42, 3, '-', 0, 0, NULL, '2026-07-10 23:53:45', 'C', '9', '6', '8', '7'),
(334, 71, 48, 4, '-', 0, 0, NULL, '2026-07-10 23:53:45', 'B', '7', '9', '8', '5'),
(335, 71, 41, 5, '-', 0, 0, NULL, '2026-07-10 23:53:45', 'D', '11', '12', '14', '13'),
(336, 71, 47, 6, '-', 0, 0, NULL, '2026-07-10 23:53:45', 'A', '4', '5', '3', '6'),
(337, 71, 44, 7, '-', 0, 0, NULL, '2026-07-10 23:53:45', 'A', '4', '6', '5', '3'),
(338, 71, 45, 8, '-', 0, 0, NULL, '2026-07-10 23:53:45', 'B', 'x', '2x', 'x²', '3x'),
(339, 71, 43, 9, '-', 0, 0, NULL, '2026-07-10 23:53:45', 'B', '20', '24', '26', '22'),
(340, 71, 50, 10, '-', 0, 0, NULL, '2026-07-10 23:53:45', 'B', '56', '49', '14', '28'),
(341, 72, 49, 1, '-', 0, 0, NULL, '2026-07-11 00:01:03', 'A', '2x+6', '2x+3', 'x+3', 'x+6'),
(342, 72, 50, 2, '-', 0, 0, NULL, '2026-07-11 00:01:03', 'D', '14', '28', '56', '49'),
(343, 72, 42, 3, '-', 0, 0, NULL, '2026-07-11 00:01:03', 'B', '9', '8', '6', '7'),
(344, 72, 48, 4, '-', 0, 0, NULL, '2026-07-11 00:01:03', 'B', '7', '9', '5', '8'),
(345, 72, 41, 5, '-', 0, 0, NULL, '2026-07-11 00:01:03', 'D', '11', '12', '14', '13'),
(346, 72, 46, 6, '-', 0, 0, NULL, '2026-07-11 00:01:03', 'C', '6a', '5a²', '5a', 'a²'),
(347, 72, 47, 7, '-', 0, 0, NULL, '2026-07-11 00:01:03', 'B', '3', '4', '6', '5'),
(348, 72, 45, 8, '-', 0, 0, NULL, '2026-07-11 00:01:03', 'D', '3x', 'x', 'x²', '2x'),
(349, 72, 44, 9, '-', 0, 0, NULL, '2026-07-11 00:01:03', 'A', '4', '5', '3', '6'),
(350, 72, 43, 10, '-', 0, 0, NULL, '2026-07-11 00:01:03', 'C', '22', '26', '24', '20'),
(351, 73, 49, 1, 'B', 1, 21, NULL, '2026-07-11 00:06:38', 'B', '2x+3', '2x+6', 'x+3', 'x+6'),
(352, 73, 42, 2, 'D', 1, 8, NULL, '2026-07-11 00:06:38', 'D', '6', '9', '7', '8'),
(353, 73, 44, 3, 'B', 1, 3, NULL, '2026-07-11 00:06:38', 'B', '6', '4', '3', '5'),
(354, 73, 50, 4, 'B', 1, 2, NULL, '2026-07-11 00:06:38', 'B', '56', '49', '28', '14'),
(355, 73, 48, 5, 'D', 1, 3, NULL, '2026-07-11 00:06:38', 'D', '7', '5', '8', '9'),
(356, 73, 46, 6, 'A', 1, 4, NULL, '2026-07-11 00:06:38', 'A', '5a', 'a²', '5a²', '6a'),
(357, 73, 41, 7, 'A', 1, 4, NULL, '2026-07-11 00:06:38', 'A', '13', '12', '11', '14'),
(358, 73, 43, 8, 'A', 1, 1, NULL, '2026-07-11 00:06:38', 'A', '24', '20', '22', '26'),
(359, 73, 45, 9, 'D', 1, 3, NULL, '2026-07-11 00:06:38', 'D', 'x²', 'x', '3x', '2x'),
(360, 73, 47, 10, 'D', 1, 5, NULL, '2026-07-11 00:06:38', 'D', '3', '6', '5', '4'),
(361, 74, 43, 1, 'C', 1, 5, NULL, '2026-07-11 06:11:25', 'C', '22', '20', '24', '26'),
(362, 74, 44, 2, 'C', 1, 5, NULL, '2026-07-11 06:11:25', 'C', '5', '6', '4', '3'),
(363, 74, 50, 3, 'A', 1, 2, NULL, '2026-07-11 06:11:25', 'A', '49', '28', '56', '14'),
(364, 74, 49, 4, 'D', 1, 3, NULL, '2026-07-11 06:11:25', 'D', 'x+6', 'x+3', '2x+3', '2x+6'),
(365, 74, 45, 5, 'B', 1, 2, NULL, '2026-07-11 06:11:25', 'B', 'x', '2x', 'x²', '3x'),
(366, 74, 46, 6, 'D', 1, 3, NULL, '2026-07-11 06:11:25', 'D', '5a²', '6a', 'a²', '5a'),
(367, 74, 48, 7, 'C', 1, 2, NULL, '2026-07-11 06:11:25', 'C', '7', '5', '9', '8'),
(368, 74, 41, 8, 'B', 1, 3, NULL, '2026-07-11 06:11:25', 'B', '12', '13', '14', '11'),
(369, 74, 42, 9, 'A', 1, 5, NULL, '2026-07-11 06:11:25', 'A', '8', '6', '7', '9'),
(370, 74, 47, 10, 'C', 1, 3, NULL, '2026-07-11 06:11:25', 'C', '6', '5', '4', '3');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `intentos_quiz`
--

CREATE TABLE `intentos_quiz` (
  `id_intento` int(11) NOT NULL,
  `id_estudiante` int(11) NOT NULL,
  `id_competencia` int(11) NOT NULL,
  `id_submodulo` int(11) NOT NULL,
  `id_tema` int(11) NOT NULL,
  `dificultad` varchar(20) NOT NULL,
  `intentos_usados` int(11) NOT NULL DEFAULT 0,
  `completado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_inicio` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_fin` datetime DEFAULT NULL,
  `abandonado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `max_intentos` int(11) NOT NULL DEFAULT 3
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `intentos_quiz`
--

INSERT INTO `intentos_quiz` (`id_intento`, `id_estudiante`, `id_competencia`, `id_submodulo`, `id_tema`, `dificultad`, `intentos_usados`, `completado`, `fecha_inicio`, `fecha_fin`, `abandonado`, `fecha_actualizacion`, `max_intentos`) VALUES
(5, 3, 1, 1, 4, '', 3, 0, '2026-06-24 22:48:24', '2026-06-25 02:30:51', 1, '2026-06-25 02:30:51', 3),
(6, 3, 1, 1, 4, '', 0, 0, '2026-06-25 07:30:51', '2026-06-25 02:42:38', 1, '2026-06-25 02:42:38', 3),
(7, 3, 1, 1, 4, '', 0, 0, '2026-06-25 07:42:38', '2026-06-25 02:44:19', 1, '2026-06-25 02:44:19', 3),
(8, 3, 1, 1, 4, '', 0, 0, '2026-06-25 07:44:19', '2026-06-25 02:55:11', 1, '2026-06-25 02:55:11', 3),
(9, 3, 1, 1, 4, '', 0, 0, '2026-06-25 07:55:11', '2026-06-25 03:01:47', 1, '2026-06-25 03:01:47', 3),
(10, 3, 1, 1, 4, '', 1, 0, '2026-06-25 08:01:47', '2026-06-25 03:04:08', 1, '2026-06-25 03:04:08', 3),
(11, 3, 1, 1, 4, '', 3, 0, '2026-06-25 08:04:08', '2026-06-25 03:06:25', 1, '2026-06-25 03:06:25', 3),
(12, 3, 1, 1, 4, '', 0, 0, '2026-06-25 08:06:25', '2026-06-25 03:07:01', 1, '2026-06-25 03:07:01', 3),
(13, 3, 1, 1, 4, '', 1, 0, '2026-06-25 08:07:01', '2026-06-25 03:17:06', 1, '2026-06-25 03:17:06', 3),
(14, 3, 1, 1, 4, '', 1, 0, '2026-06-25 08:17:06', '2026-06-25 03:17:47', 1, '2026-06-25 03:17:47', 3),
(15, 3, 1, 1, 4, '', 1, 0, '2026-06-25 08:17:47', '2026-06-25 03:21:34', 1, '2026-06-25 03:21:34', 3),
(16, 3, 1, 1, 4, '', 2, 0, '2026-06-25 08:21:34', '2026-06-25 03:25:19', 1, '2026-06-25 03:25:19', 3),
(17, 3, 1, 1, 4, '', 2, 0, '2026-06-25 08:25:19', '2026-06-25 04:31:48', 1, '2026-06-25 04:31:48', 3),
(18, 3, 1, 1, 4, '', 0, 0, '2026-06-25 09:31:48', '2026-06-25 15:47:35', 1, '2026-06-25 15:47:35', 3),
(19, 3, 1, 1, 4, '', 0, 0, '2026-06-25 20:47:35', '2026-06-25 16:05:24', 1, '2026-06-25 16:05:24', 3),
(20, 3, 1, 1, 4, '', 0, 0, '2026-06-25 21:05:24', '2026-06-25 16:17:27', 1, '2026-06-25 16:17:27', 3),
(21, 3, 1, 1, 4, '', 0, 0, '2026-06-25 21:17:27', '2026-06-25 16:37:55', 1, '2026-06-25 16:37:55', 3),
(22, 3, 1, 1, 4, '', 1, 0, '2026-06-25 21:37:55', '2026-06-25 17:36:42', 1, '2026-06-25 17:36:42', 3),
(23, 3, 1, 1, 4, '', 0, 0, '2026-06-25 22:36:42', '2026-06-25 17:38:36', 1, '2026-06-25 17:38:36', 3),
(24, 3, 1, 1, 4, '', 4, 0, '2026-06-25 22:38:36', '2026-06-25 18:16:56', 1, '2026-06-25 18:16:56', 3),
(25, 3, 1, 1, 4, '', 3, 0, '2026-06-25 23:16:56', '2026-06-25 20:31:11', 1, '2026-06-25 20:31:11', 3),
(26, 3, 1, 1, 4, '', 0, 0, '2026-06-26 01:31:11', '2026-06-25 20:46:25', 1, '2026-06-25 20:46:25', 3),
(27, 3, 1, 1, 4, '', 1, 0, '2026-06-26 01:46:25', '2026-06-25 21:14:47', 1, '2026-06-25 21:14:47', 3),
(28, 3, 1, 1, 4, '', 1, 0, '2026-06-26 02:14:47', '2026-06-25 21:16:42', 1, '2026-06-25 21:16:42', 3),
(29, 3, 1, 1, 4, '', 0, 0, '2026-06-26 02:16:42', '2026-06-25 21:51:07', 1, '2026-06-25 21:51:07', 3),
(30, 3, 1, 1, 4, '', 0, 0, '2026-06-26 02:51:07', '2026-06-25 22:44:29', 1, '2026-06-25 22:44:29', 3),
(31, 3, 1, 1, 4, '', 3, 0, '2026-06-26 03:44:29', '2026-06-25 23:11:00', 1, '2026-06-25 23:11:00', 3),
(32, 3, 1, 1, 4, '', 3, 0, '2026-06-26 04:11:00', '2026-06-25 23:17:21', 1, '2026-06-25 23:17:21', 3),
(33, 3, 1, 1, 4, '', 3, 0, '2026-06-26 04:17:21', '2026-06-25 23:26:42', 1, '2026-06-25 23:26:42', 3),
(34, 3, 1, 1, 4, '', 3, 0, '2026-06-26 04:26:42', '2026-06-25 23:53:17', 1, '2026-06-25 23:53:17', 3),
(35, 3, 1, 1, 4, '', 3, 0, '2026-06-26 04:53:17', '2026-06-26 05:04:41', 1, '2026-06-26 05:04:41', 3),
(36, 3, 1, 1, 4, '', 0, 0, '2026-06-26 10:04:41', '2026-06-26 05:43:20', 1, '2026-06-26 05:43:20', 3),
(37, 3, 1, 1, 4, '', 2, 0, '2026-06-26 10:43:20', '2026-06-26 05:50:00', 1, '2026-06-26 05:50:00', 3),
(38, 3, 1, 1, 4, '', 0, 0, '2026-06-26 10:50:00', '2026-06-26 05:54:59', 1, '2026-06-26 05:54:59', 3),
(39, 3, 1, 1, 4, '', 0, 0, '2026-06-26 10:54:59', '2026-06-26 15:02:46', 1, '2026-06-26 15:02:46', 3),
(40, 3, 1, 1, 4, '', 3, 0, '2026-06-26 20:02:46', '2026-06-26 15:08:19', 1, '2026-06-26 15:08:19', 3),
(41, 3, 1, 1, 4, '', 0, 0, '2026-06-26 20:08:19', '2026-06-26 15:12:19', 1, '2026-06-26 15:12:19', 3),
(42, 3, 1, 1, 4, '', 3, 0, '2026-06-26 20:12:19', '2026-06-26 15:55:15', 1, '2026-06-26 15:55:15', 3),
(43, 3, 1, 1, 4, '', 3, 0, '2026-06-26 20:55:15', '2026-06-26 15:58:35', 1, '2026-06-26 15:58:35', 3),
(44, 3, 1, 1, 4, '', 3, 0, '2026-06-26 20:58:35', '2026-06-26 19:56:00', 1, '2026-06-26 19:56:00', 3),
(45, 3, 1, 1, 4, '', 0, 0, '2026-06-27 00:56:00', '2026-06-26 19:58:33', 1, '2026-06-26 19:58:33', 3),
(46, 3, 1, 1, 4, '', 3, 0, '2026-06-27 00:58:33', '2026-06-26 20:20:44', 1, '2026-06-26 20:20:44', 3),
(47, 3, 1, 1, 4, '', 3, 0, '2026-06-27 01:20:44', '2026-06-26 20:49:21', 1, '2026-06-26 20:49:21', 3),
(48, 3, 1, 1, 4, '', 2, 0, '2026-06-27 01:49:21', '2026-06-26 22:44:30', 1, '2026-06-26 22:44:30', 3),
(49, 3, 1, 1, 4, '', 0, 0, '2026-06-27 03:44:30', '2026-06-26 23:05:28', 1, '2026-06-26 23:05:28', 3),
(50, 3, 1, 1, 4, '', 0, 0, '2026-06-27 04:05:28', '2026-06-27 04:19:47', 1, '2026-06-27 04:19:47', 3),
(51, 3, 1, 1, 4, '', 2, 0, '2026-06-27 09:19:47', '2026-06-27 04:59:20', 1, '2026-06-27 04:59:20', 3),
(52, 3, 1, 1, 4, '', 2, 0, '2026-06-27 09:59:20', '2026-06-27 05:50:03', 1, '2026-06-27 05:50:03', 3),
(53, 3, 1, 1, 4, '', 1, 0, '2026-06-27 10:50:03', '2026-06-28 02:26:05', 1, '2026-06-28 02:26:05', 3),
(54, 3, 1, 1, 4, '', 3, 0, '2026-06-28 07:26:05', '2026-06-28 17:50:26', 1, '2026-06-28 17:50:26', 3),
(55, 3, 1, 1, 4, '', 0, 0, '2026-06-28 22:50:26', '2026-06-28 18:03:20', 1, '2026-06-28 18:03:20', 3),
(56, 3, 1, 1, 4, '', 0, 0, '2026-06-28 23:03:20', '2026-06-28 20:46:42', 1, '2026-06-28 20:46:42', 3),
(57, 3, 1, 1, 4, '', 0, 0, '2026-06-29 01:46:42', '2026-06-29 23:07:36', 1, '2026-06-29 23:07:36', 3),
(58, 3, 1, 1, 4, 'Intermedio', 3, 0, '2026-06-30 04:07:36', '2026-07-03 23:14:09', 1, '2026-07-03 23:14:09', 3),
(59, 3, 1, 1, 4, 'Básico', 3, 0, '2026-07-04 04:14:09', '2026-07-06 04:53:33', 1, '2026-07-06 04:53:33', 3),
(60, 3, 1, 1, 4, 'Básico', 3, 0, '2026-07-06 09:53:33', '2026-07-07 03:18:18', 1, '2026-07-07 03:18:18', 3),
(61, 3, 1, 1, 4, 'Básico', 3, 0, '2026-07-07 08:18:18', '2026-07-07 14:48:40', 1, '2026-07-07 14:48:40', 3),
(62, 3, 1, 1, 4, 'Básico', 3, 0, '2026-07-07 19:48:40', '2026-07-07 16:53:49', 1, '2026-07-07 16:53:49', 3),
(63, 3, 1, 1, 4, 'Básico', 3, 0, '2026-07-07 21:53:49', '2026-07-07 20:52:12', 1, '2026-07-07 20:52:12', 3),
(64, 3, 1, 1, 4, 'Básico', 3, 0, '2026-07-08 01:52:12', '2026-07-07 21:17:55', 1, '2026-07-07 21:17:55', 3),
(65, 3, 1, 1, 4, 'Avanzado', 3, 0, '2026-07-08 02:17:55', '2026-07-10 20:34:43', 1, '2026-07-10 20:34:43', 3),
(66, 3, 1, 1, 4, 'Básico', 0, 0, '2026-07-11 01:34:43', '2026-07-10 21:21:38', 1, '2026-07-10 21:21:38', 3),
(67, 3, 1, 1, 4, 'Básico', 3, 0, '2026-07-11 02:21:38', '2026-07-10 21:38:38', 1, '2026-07-10 21:38:38', 3),
(68, 3, 1, 1, 4, 'Básico', 1, 0, '2026-07-11 02:38:38', '2026-07-10 23:40:57', 1, '2026-07-10 23:40:57', 3),
(69, 3, 1, 1, 4, 'Básico', 0, 0, '2026-07-11 04:40:57', '2026-07-10 23:52:11', 1, '2026-07-10 23:52:11', 3),
(70, 3, 1, 1, 4, 'Básico', 0, 0, '2026-07-11 04:52:11', '2026-07-10 23:53:45', 1, '2026-07-10 23:53:45', 3),
(71, 3, 1, 1, 4, 'Básico', 0, 0, '2026-07-11 04:53:45', '2026-07-11 00:01:03', 1, '2026-07-11 00:01:03', 3),
(72, 3, 1, 1, 4, 'Básico', 0, 0, '2026-07-11 05:01:03', '2026-07-11 00:06:38', 1, '2026-07-11 00:06:38', 3),
(73, 3, 1, 1, 4, 'Básico', 2, 0, '2026-07-11 05:06:38', '2026-07-11 06:11:25', 1, '2026-07-11 06:11:25', 3),
(74, 3, 1, 1, 4, 'Básico', 1, 0, '2026-07-11 11:11:25', NULL, 0, '2026-07-11 06:11:35', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `niveles_educativos`
--

CREATE TABLE `niveles_educativos` (
  `id_nivel` int(11) NOT NULL,
  `nombre_nivel` varchar(150) NOT NULL,
  `descripcion` text NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `niveles_educativos`
--

INSERT INTO `niveles_educativos` (`id_nivel`, `nombre_nivel`, `descripcion`, `estado`, `created_at`, `update_at`) VALUES
(1, 'Bachillerato', 'Estudiantes de bachillerato', 1, '2026-06-12 17:36:09', '2026-06-12 17:36:09'),
(2, 'Nivelación y Admisión', 'Curso de nivelación y admisión', 1, '2026-06-12 17:36:09', '2026-06-12 17:36:09'),
(3, 'Primer Semestre', 'Estudiantes de primer semestre', 1, '2026-06-12 17:36:09', '2026-06-12 17:36:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_resets`
--

CREATE TABLE `password_resets` (
  `id_password` int(11) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `periodos_academicos`
--

CREATE TABLE `periodos_academicos` (
  `id_periodo` int(11) NOT NULL,
  `id_nivel` int(11) NOT NULL,
  `nombre_periodo` varchar(80) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `periodos_academicos`
--

INSERT INTO `periodos_academicos` (`id_periodo`, `id_nivel`, `nombre_periodo`, `descripcion`, `fecha_inicio`, `fecha_fin`, `estado`, `created_at`) VALUES
(1, 1, '2025 - 2026', 'Periodo lectivo régimen Costa 2025-2026', '2025-05-05', '2026-02-27', 1, '2026-07-11 03:21:55'),
(2, 1, '2026 - 2027', 'Periodo lectivo régimen Costa 2026-2027', '2026-05-04', '2027-02-26', 1, '2026-07-11 03:21:55'),
(3, 1, '2027 - 2028', 'Periodo lectivo régimen Costa 2027-2028', '2027-05-03', '2028-02-25', 1, '2026-07-11 03:21:55'),
(4, 2, '2026 CI', 'Curso de Nivelación y Admisión ciclo I 2026', '2026-05-11', '2026-08-14', 1, '2026-07-11 03:21:55'),
(5, 2, '2026 CII', 'Curso de Nivelación y Admisión ciclo II 2026', '2026-10-05', '2027-01-29', 1, '2026-07-11 03:21:55'),
(6, 2, '2027 CI', 'Curso de Nivelación y Admisión ciclo I 2027', '2027-05-10', '2027-08-13', 1, '2026-07-11 03:21:55'),
(7, 3, '2026 CI', 'Primer semestre ciclo I 2026', '2026-05-11', '2026-09-30', 1, '2026-07-11 03:21:55'),
(8, 3, '2026 CII', 'Primer semestre ciclo II 2026', '2026-10-12', '2027-02-26', 1, '2026-07-11 03:21:55'),
(9, 3, '2027 CI', 'Primer semestre ciclo I 2027', '2027-05-10', '2027-09-30', 1, '2026-07-11 03:21:55');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas_competencias`
--

CREATE TABLE `preguntas_competencias` (
  `id_pregunta` int(11) NOT NULL,
  `id_profesor` int(11) NOT NULL,
  `id_nivel` int(11) NOT NULL,
  `id_competencia` int(11) NOT NULL,
  `id_tema` int(11) NOT NULL,
  `id_submodulo` int(11) NOT NULL,
  `dificultad` varchar(50) NOT NULL,
  `pregunta` text NOT NULL,
  `opcion_a` text NOT NULL,
  `opcion_b` text NOT NULL,
  `opcion_c` text NOT NULL,
  `opcion_d` text NOT NULL,
  `respuesta_correcta` char(1) NOT NULL,
  `justificacion` text NOT NULL,
  `tiempo_estimado` int(11) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `preguntas_competencias`
--

INSERT INTO `preguntas_competencias` (`id_pregunta`, `id_profesor`, `id_nivel`, `id_competencia`, `id_tema`, `id_submodulo`, `dificultad`, `pregunta`, `opcion_a`, `opcion_b`, `opcion_c`, `opcion_d`, `respuesta_correcta`, `justificacion`, `tiempo_estimado`, `estado`, `created_at`, `update_at`) VALUES
(21, 2, 1, 1, 1, 1, 'Básico', 'Resolver: 2x + 3 = 11', 'x=2', 'x=3', 'x=4', 'x=5', 'C', 'Para resolver una ecuación lineal es necesario aislar la variable. Primero se resta 3 en ambos lados de la igualdad obteniendo 2x=8 y posteriormente se divide entre 2. El resultado correcto es x=4.', 30, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(22, 2, 1, 1, 1, 1, 'Básico', 'Resolver: 5x = 25', 'x=3', 'x=4', 'x=5', 'x=6', 'C', 'Cuando una variable está multiplicada por un número, se aplica la operación inversa para despejarla. Al dividir ambos lados entre 5 se obtiene x=5.', 30, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(23, 2, 1, 1, 1, 1, 'Básico', 'Resolver: x - 7 = 5', 'x=10', 'x=11', 'x=12', 'x=13', 'C', 'Para despejar la variable se suma 7 en ambos lados de la ecuación. Esto conserva la igualdad y permite obtener x=12.', 30, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(24, 2, 1, 1, 1, 1, 'Básico', 'Resolver: 3x + 2 = 14', 'x=3', 'x=4', 'x=5', 'x=6', 'B', 'Primero se resta 2 en ambos lados de la igualdad, obteniendo 3x=12. Luego se divide entre 3 para encontrar el valor de x.', 30, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(25, 2, 1, 1, 1, 1, 'Básico', 'Resolver: x/2 = 6', 'x=8', 'x=10', 'x=12', 'x=14', 'C', 'Cuando una variable está dividida por un número, se multiplica ambos lados por dicho valor para aislarla. Así se obtiene x=12.', 30, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(26, 2, 1, 1, 1, 1, 'Básico', 'Si f(x)=x+2, calcular f(5)', '5', '6', '7', '8', 'C', 'Una función asigna un valor de salida para cada entrada. Sustituyendo x=5 en la expresión se obtiene f(5)=5+2=7.', 30, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(27, 2, 1, 1, 1, 1, 'Básico', 'Si f(x)=2x, calcular f(4)', '6', '8', '10', '12', 'B', 'Para evaluar una función se reemplaza la variable por el valor indicado. Al sustituir x=4 se obtiene f(4)=2×4=8.', 30, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(28, 2, 1, 1, 1, 1, 'Básico', 'Resolver: 4x - 8 = 0', 'x=1', 'x=2', 'x=3', 'x=4', 'B', 'Se suma 8 a ambos lados para obtener 4x=8. Luego se divide entre 4 para encontrar el valor de la incógnita.', 30, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(29, 2, 1, 1, 1, 1, 'Intermedio', 'Resolver: 2(x+3)=14', 'x=3', 'x=4', 'x=5', 'x=6', 'B', 'Primero se divide entre 2 en ambos lados de la ecuación, obteniendo x+3=7. Finalmente se resta 3 para encontrar x=4.', 45, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(30, 2, 1, 1, 1, 1, 'Intermedio', 'Resolver: 3(x-2)=9', 'x=3', 'x=4', 'x=5', 'x=6', 'C', 'Se divide ambos lados entre 3 para simplificar la expresión y obtener x−2=3. Luego se suma 2 en ambos lados para hallar x=5.', 45, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(31, 2, 1, 1, 1, 1, 'Intermedio', 'Si f(x)=x², calcular f(6)', '30', '32', '34', '36', 'D', 'La función cuadrática eleva al cuadrado el valor de entrada. Al sustituir x=6 se obtiene 6²=36.', 45, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(32, 2, 1, 1, 1, 1, 'Intermedio', 'Resolver: x²=49', 'x=5', 'x=6', 'x=7', 'x=8', 'C', 'La ecuación indica que el cuadrado de un número es 49. La raíz cuadrada principal de 49 es 7, por lo que esa es la respuesta esperada.', 45, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(33, 2, 1, 1, 1, 1, 'Intermedio', 'Hallar la pendiente entre (1,2) y (3,6)', '1', '2', '3', '4', 'B', 'La pendiente mide la variación vertical respecto a la horizontal. Aplicando la fórmula m=(y₂−y₁)/(x₂−x₁) se obtiene (6−2)/(3−1)=2.', 60, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(34, 2, 1, 1, 1, 1, 'Intermedio', 'Resolver: 2x+5=3x−1', 'x=4', 'x=5', 'x=6', 'x=7', 'C', 'Se trasladan los términos con x a un lado y las constantes al otro. Al simplificar la ecuación se obtiene x=6.', 60, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(35, 2, 1, 1, 1, 1, 'Intermedio', 'Si f(x)=3x−2, calcular f(7)', '17', '18', '19', '20', 'C', 'La evaluación de funciones consiste en reemplazar la variable por el valor indicado. Al sustituir x=7 se obtiene 3(7)−2=19.', 60, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(36, 2, 1, 1, 1, 1, 'Avanzado', 'Resolver: x²−9=0', 'x=±3', 'x=±2', 'x=3', 'x=−3', 'A', 'La ecuación puede reescribirse como x²=9. Las soluciones son los dos números cuyo cuadrado es 9, es decir, x=3 y x=−3.', 90, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(37, 2, 1, 1, 1, 1, 'Avanzado', 'Resolver: x²−5x+6=0', '2 y 3', '1 y 6', '2 y 4', '3 y 5', 'A', 'El trinomio puede factorizarse como (x−2)(x−3)=0. Por la propiedad del producto nulo, las soluciones son x=2 y x=3.', 90, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(38, 2, 1, 1, 1, 1, 'Avanzado', 'Si f(x)=2x²−3x, calcular f(4)', '18', '20', '22', '24', 'B', 'Se sustituye x=4 en la función y se realizan las operaciones respetando el orden matemático. El resultado es 2(16)−12=20.', 90, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(39, 2, 1, 1, 1, 1, 'Avanzado', 'Resolver el sistema: x+y=10, x−y=2', 'x=6,y=4', 'x=4,y=6', 'x=5,y=5', 'x=7,y=3', 'A', 'Sumando ambas ecuaciones se elimina la variable y, obteniendo 2x=12. Luego se calcula x=6 y sustituyendo en una de las ecuaciones se obtiene y=4.', 90, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(40, 2, 1, 1, 1, 1, 'Avanzado', 'Si f(x)=x²−4x+3, hallar f(2)', '−1', '0', '1', '2', 'A', 'Se reemplaza x por 2 y se realizan las operaciones correspondientes. El resultado es 2²−4(2)+3=−1.', 90, 1, '2026-06-16 04:36:11', '2026-06-16 04:36:11'),
(41, 3, 2, 1, 4, 1, 'Básico', '¿Cuánto es 5 + 8?', '11', '12', '13', '14', 'C', 'La suma de 5 y 8 es 13.', 45, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(42, 3, 2, 1, 4, 1, 'Básico', '¿Cuánto es 15 - 7?', '8', '7', '9', '6', 'A', 'Al restar 7 de 15 se obtiene 8.', 45, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(43, 3, 2, 1, 4, 1, 'Básico', '¿Cuánto es 6 × 4?', '20', '22', '24', '26', 'C', 'Multiplicar 6 por 4 da 24.', 45, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(44, 3, 2, 1, 4, 1, 'Básico', '¿Cuánto es 24 ÷ 6?', '3', '4', '5', '6', 'B', '24 dividido para 6 es igual a 4.', 45, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(45, 3, 2, 1, 4, 1, 'Básico', 'Simplifique: x + x', 'x²', '2x', 'x', '3x', 'B', 'Son términos semejantes.', 60, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(46, 3, 2, 1, 4, 1, 'Básico', 'Simplifique: 3a + 2a', '5a', '6a', 'a²', '5a²', 'A', 'Se suman coeficientes.', 60, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(47, 3, 2, 1, 4, 1, 'Básico', 'Resolver: x + 5 = 9', '3', '4', '5', '6', 'B', 'Restando 5 se obtiene x=4.', 60, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(48, 3, 2, 1, 4, 1, 'Básico', 'Resolver: x - 2 = 7', '5', '7', '8', '9', 'D', 'Sumando 2 se obtiene x=9.', 60, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(49, 3, 2, 1, 4, 1, 'Básico', 'Simplifique: 2(x+3)', '2x+3', '2x+6', 'x+6', 'x+3', 'B', 'Aplicando distributiva.', 60, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(50, 3, 2, 1, 4, 1, 'Básico', '¿Cuánto es 7²?', '14', '28', '49', '56', 'C', '7×7=49.', 45, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(51, 3, 2, 1, 4, 1, 'Intermedio', 'Resolver: 2x + 4 = 10', '2', '3', '4', '5', 'B', 'Restando 4 y dividiendo para 2.', 75, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(52, 3, 2, 1, 4, 1, 'Intermedio', 'Resolver: 3x = 18', '4', '5', '6', '7', 'C', '18 dividido para 3 es 6.', 75, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(53, 3, 2, 1, 4, 1, 'Intermedio', 'Simplifique: x²·x³', 'x⁵', 'x⁶', 'x⁹', 'x²', 'A', 'Se suman exponentes.', 90, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(54, 3, 2, 1, 4, 1, 'Intermedio', 'Simplifique: (2a)(3a)', '5a', '6a', '6a²', '5a²', 'C', 'Se multiplican coeficientes y variables.', 90, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(55, 3, 2, 1, 4, 1, 'Intermedio', 'Resolver: x/4 = 3', '10', '11', '12', '13', 'C', 'Multiplicando por 4.', 75, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(56, 3, 2, 1, 4, 1, 'Intermedio', 'Factorice: 4x + 8', '4(x+2)', '8(x+1)', '2(x+4)', '4x(2)', 'A', 'Se extrae factor común 4.', 90, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(57, 3, 2, 1, 4, 1, 'Intermedio', 'Resolver: y + 7 = 15', '6', '7', '8', '9', 'C', 'Restando 7.', 75, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(58, 3, 2, 1, 4, 1, 'Intermedio', 'Resolver: 5x - 10 = 15', '3', '4', '5', '6', 'C', 'Sumando 10 y dividiendo para 5.', 90, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(59, 3, 2, 1, 4, 1, 'Intermedio', 'Simplifique: (x²)³', 'x⁵', 'x⁶', 'x⁹', 'x⁸', 'B', 'Se multiplican exponentes.', 90, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(60, 3, 2, 1, 4, 1, 'Intermedio', 'Resolver: 2(x-1)=8', '3', '4', '5', '6', 'C', 'Aplicando operaciones inversas.', 90, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(61, 3, 2, 1, 4, 1, 'Avanzado', 'Resolver: x² - 9 = 0', '±2', '±3', '±4', '±5', 'B', 'Diferencia de cuadrados.', 120, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(62, 3, 2, 1, 4, 1, 'Avanzado', 'Factorice: x² - 25', '(x-5)(x+5)', '(x-25)(x+1)', '(x-5)²', '(x+5)²', 'A', 'Diferencia de cuadrados perfectos.', 120, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(63, 3, 2, 1, 4, 1, 'Avanzado', 'Resolver: x² - 4x = 0', '0 y 4', '1 y 4', '2 y 2', '0 y 2', 'A', 'Factorizando x(x-4).', 120, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(64, 3, 2, 1, 4, 1, 'Avanzado', 'Resolver: x² - 5x + 6 = 0', '1 y 6', '2 y 3', '3 y 6', '1 y 5', 'B', 'Factorizando el trinomio.', 120, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(65, 3, 2, 1, 4, 1, 'Avanzado', 'Simplifique: (x²y³)(xy²)', 'x³y⁵', 'x²y⁵', 'x³y⁶', 'x⁴y⁵', 'A', 'Se suman exponentes.', 120, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(66, 3, 2, 1, 4, 1, 'Avanzado', 'Resolver: 2x² - 8 = 0', '±1', '±2', '±3', '±4', 'B', 'x²=4.', 120, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(67, 3, 2, 1, 4, 1, 'Avanzado', 'Factorice: x² + 7x + 12', '(x+3)(x+4)', '(x+2)(x+6)', '(x+1)(x+12)', '(x+4)²', 'A', 'Producto 12 y suma 7.', 120, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(68, 3, 2, 1, 4, 1, 'Avanzado', 'Resolver: x² = 49', '±5', '±6', '±7', '±8', 'C', 'Raíz cuadrada de 49.', 120, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(69, 3, 2, 1, 4, 1, 'Avanzado', 'Simplifique: (a³)²', 'a⁵', 'a⁶', 'a⁹', 'a³', 'B', 'Se multiplican exponentes.', 120, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(70, 3, 2, 1, 4, 1, 'Avanzado', 'Resolver: x² - 16 = 0', '±2', '±3', '±4', '±5', 'C', 'x²=16.', 120, 1, '2026-06-21 01:21:07', '2026-06-24 03:52:56'),
(71, 3, 2, 2, 5, 1, 'Básico', '¿Cuántos lados tiene un triángulo?', '2', '3', '4', '5', 'B', 'Un triángulo siempre tiene tres lados.', 60, 1, '2026-07-08 18:09:34', '2026-07-08 18:09:34'),
(72, 3, 2, 2, 5, 1, 'Básico', '¿Cuál es la unidad principal para medir longitud en el SI?', 'Metro', 'Litro', 'Kilogramo', 'Segundo', 'A', 'El metro es la unidad básica de longitud.', 60, 1, '2026-07-08 18:09:34', '2026-07-08 18:09:34'),
(73, 3, 2, 2, 5, 1, 'Básico', '¿Cuál es el perímetro de un cuadrado cuyo lado mide 6 cm?', '12 cm', '18 cm', '24 cm', '36 cm', 'C', 'El perímetro es la suma de los cuatro lados (6×4).', 60, 1, '2026-07-08 18:09:34', '2026-07-08 18:09:34'),
(74, 3, 2, 2, 5, 1, 'Intermedio', 'Un rectángulo mide 8 cm de largo y 5 cm de ancho. ¿Cuál es su área?', '13 cm²', '26 cm²', '40 cm²', '80 cm²', 'C', 'Área = largo × ancho.', 60, 1, '2026-07-08 18:09:34', '2026-07-08 18:09:34'),
(75, 3, 2, 2, 5, 1, 'Intermedio', '¿Cuál es el volumen de un cubo cuyo lado mide 3 cm?', '9 cm³', '18 cm³', '27 cm³', '36 cm³', 'C', 'Volumen = lado³ = 3³.', 60, 1, '2026-07-08 18:09:34', '2026-07-08 18:09:34'),
(76, 3, 2, 2, 5, 1, 'Intermedio', 'Un círculo tiene radio de 7 cm. ¿Qué fórmula permite calcular su área?', 'πr', '2πr²', 'πr²', '2πr', 'C', 'El área de un círculo es πr².', 60, 1, '2026-07-08 18:09:34', '2026-07-08 18:09:34'),
(77, 3, 2, 2, 5, 1, 'Avanzado', 'Un prisma rectangular mide 10 cm × 5 cm × 4 cm. ¿Cuál es su volumen?', '90 cm³', '150 cm³', '180 cm³', '200 cm³', 'D', 'Volumen = largo × ancho × alto.', 60, 1, '2026-07-08 18:09:34', '2026-07-08 18:09:34'),
(78, 3, 2, 2, 5, 1, 'Avanzado', 'Un terreno rectangular tiene un área de 96 m² y un ancho de 8 m. ¿Cuál es su largo?', '10 m', '12 m', '14 m', '16 m', 'B', 'Largo = Área ÷ Ancho = 96 ÷ 8.', 60, 1, '2026-07-08 18:09:34', '2026-07-08 18:09:34'),
(79, 3, 2, 2, 5, 1, 'Avanzado', '¿Cuál es el área total de un cubo de lado 5 cm?', '100 cm²', '125 cm²', '150 cm²', '250 cm²', 'C', 'Área total = 6 × lado² = 6 × 25.', 60, 1, '2026-07-08 18:09:34', '2026-07-08 18:09:34'),
(80, 3, 2, 2, 5, 1, 'Básico', '¿Cuántos lados tiene un triángulo?', '2', '3', '4', '5', 'B', 'Un triángulo siempre tiene tres lados.', 60, 1, '2026-07-08 18:09:37', '2026-07-08 18:09:37'),
(81, 3, 2, 2, 5, 1, 'Básico', '¿Cuál es la unidad principal para medir longitud en el SI?', 'Metro', 'Litro', 'Kilogramo', 'Segundo', 'A', 'El metro es la unidad básica de longitud.', 60, 1, '2026-07-08 18:09:37', '2026-07-08 18:09:37'),
(82, 3, 2, 2, 5, 1, 'Básico', '¿Cuál es el perímetro de un cuadrado cuyo lado mide 6 cm?', '12 cm', '18 cm', '24 cm', '36 cm', 'C', 'El perímetro es la suma de los cuatro lados (6×4).', 60, 1, '2026-07-08 18:09:37', '2026-07-08 18:09:37'),
(83, 3, 2, 2, 5, 1, 'Intermedio', 'Un rectángulo mide 8 cm de largo y 5 cm de ancho. ¿Cuál es su área?', '13 cm²', '26 cm²', '40 cm²', '80 cm²', 'C', 'Área = largo × ancho.', 60, 1, '2026-07-08 18:09:37', '2026-07-08 18:09:37'),
(84, 3, 2, 2, 5, 1, 'Intermedio', '¿Cuál es el volumen de un cubo cuyo lado mide 3 cm?', '9 cm³', '18 cm³', '27 cm³', '36 cm³', 'C', 'Volumen = lado³ = 3³.', 60, 1, '2026-07-08 18:09:37', '2026-07-08 18:09:37'),
(85, 3, 2, 2, 5, 1, 'Intermedio', 'Un círculo tiene radio de 7 cm. ¿Qué fórmula permite calcular su área?', 'πr', '2πr²', 'πr²', '2πr', 'C', 'El área de un círculo es πr².', 60, 1, '2026-07-08 18:09:37', '2026-07-08 18:09:37'),
(86, 3, 2, 2, 5, 1, 'Avanzado', 'Un prisma rectangular mide 10 cm × 5 cm × 4 cm. ¿Cuál es su volumen?', '90 cm³', '150 cm³', '180 cm³', '200 cm³', 'D', 'Volumen = largo × ancho × alto.', 60, 1, '2026-07-08 18:09:37', '2026-07-08 18:09:37'),
(87, 3, 2, 2, 5, 1, 'Avanzado', 'Un terreno rectangular tiene un área de 96 m² y un ancho de 8 m. ¿Cuál es su largo?', '10 m', '12 m', '14 m', '16 m', 'B', 'Largo = Área ÷ Ancho = 96 ÷ 8.', 60, 1, '2026-07-08 18:09:37', '2026-07-08 18:09:37'),
(88, 3, 2, 2, 5, 1, 'Avanzado', '¿Cuál es el área total de un cubo de lado 5 cm?', '100 cm²', '125 cm²', '150 cm²', '250 cm²', 'C', 'Área total = 6 × lado² = 6 × 25.', 60, 1, '2026-07-08 18:09:37', '2026-07-09 22:25:56');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesores`
--

CREATE TABLE `profesores` (
  `id_profesor` int(11) NOT NULL,
  `nombre_profesor` varchar(200) NOT NULL,
  `institucion_educativa` varchar(200) NOT NULL,
  `id_nivel` int(11) NOT NULL,
  `id_tipo_institucion` int(11) DEFAULT NULL,
  `id_carrera` int(11) DEFAULT NULL,
  `id_provincia` int(11) NOT NULL,
  `id_ciudad` int(11) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ultimo_acceso` timestamp NULL DEFAULT NULL,
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `profesores`
--

INSERT INTO `profesores` (`id_profesor`, `nombre_profesor`, `institucion_educativa`, `id_nivel`, `id_tipo_institucion`, `id_carrera`, `id_provincia`, `id_ciudad`, `correo`, `password_hash`, `id_rol`, `estado`, `created_at`, `ultimo_acceso`, `update_at`) VALUES
(1, 'Carlos Mendoza', 'Universidad de Durán', 3, 1, 1, 1, 1, 'carlos@ud.edu.ec', '$2b$12$Qb35KLSrrIAA4Iz2yxON9Omt/nhwpsYIHkAZ3LCMxsLUHiaKvUz/S', 2, 1, '2026-06-13 19:12:55', NULL, '2026-06-13 19:14:47'),
(2, 'Carlos Mendoza', 'Unidad Educativa Fiscal Guayaquil', 1, 1, NULL, 1, 1, 'carlos.mendoza@gmail.com', '$2b$12$KtB1dUAG47Y7uXBcTLxP6edyCk9P8UfgFjNRhp8DdFlxk328COby2', 2, 1, '2026-06-16 04:35:00', NULL, '2026-06-16 04:35:00'),
(3, 'Pedro Juaquin', 'Universidad de Guayaquil', 2, NULL, 1, 1, 1, 'pedrojuaquin@ug.edu.ec', '$2b$12$qpmdIHvblAdEuMLsyIKc1O3xWTAbWbdhQTzPCUOLTzVT2qLxfT4b6', 2, 1, '2026-06-20 20:32:59', NULL, '2026-06-20 20:32:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `provincia`
--

CREATE TABLE `provincia` (
  `id_provincia` int(11) NOT NULL,
  `nombre_provincia` varchar(150) NOT NULL,
  `descripcion_provincia` text NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `provincia`
--

INSERT INTO `provincia` (`id_provincia`, `nombre_provincia`, `descripcion_provincia`, `estado`, `created_at`) VALUES
(1, 'Guayas', 'Provincia del Guayas', 1, '2026-06-12 17:36:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultados_quiz`
--

CREATE TABLE `resultados_quiz` (
  `id_resultado` int(11) NOT NULL,
  `id_intento` int(11) NOT NULL,
  `id_estudiante` int(11) NOT NULL,
  `id_competencia` int(11) NOT NULL,
  `id_submodulo` int(11) NOT NULL,
  `id_tema` int(11) NOT NULL,
  `dificultad` varchar(20) NOT NULL,
  `puntaje` float NOT NULL,
  `porcentaje` float NOT NULL,
  `nivel_desempeno` varchar(40) NOT NULL,
  `correctas` int(11) NOT NULL,
  `incorrectas` int(11) NOT NULL,
  `total_preguntas` int(11) NOT NULL,
  `tiempo_segundos` int(11) NOT NULL DEFAULT 0,
  `intento` int(11) NOT NULL DEFAULT 1,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `retroalimentacion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `resultados_quiz`
--

INSERT INTO `resultados_quiz` (`id_resultado`, `id_intento`, `id_estudiante`, `id_competencia`, `id_submodulo`, `id_tema`, `dificultad`, `puntaje`, `porcentaje`, `nivel_desempeno`, `correctas`, `incorrectas`, `total_preguntas`, `tiempo_segundos`, `intento`, `fecha`, `retroalimentacion`) VALUES
(1, 40, 3, 1, 1, 4, '', 100, 100, 'Excelente', 7, 0, 7, 85, 1, '2026-06-26 15:04:11', 'Excelente desempeño. Ha demostrado un dominio sólido de los contenidos.'),
(2, 42, 3, 1, 1, 4, '', 100, 100, 'Excelente', 6, 0, 6, 79, 2, '2026-06-26 15:13:39', 'Excelente desempeño. Ha demostrado un dominio sólido de los contenidos.'),
(3, 43, 3, 1, 1, 4, '', 100, 100, 'Excelente', 5, 0, 5, 84, 3, '2026-06-26 15:56:40', 'Excelente desempeño. Ha demostrado un dominio sólido de los contenidos.'),
(4, 44, 3, 1, 1, 4, '', 62.5, 62.5, 'En proceso', 5, 3, 8, 73, 4, '2026-06-26 15:59:49', 'Presenta avances, pero aún existen temas que requieren práctica.'),
(5, 45, 3, 1, 1, 4, '', 100, 100, 'Excelente', 10, 0, 10, 88, 5, '2026-06-26 19:57:29', 'Excelente desempeño. Ha demostrado un dominio sólido de los contenidos.'),
(6, 46, 3, 1, 1, 4, '', 60, 60, 'En proceso', 6, 4, 10, 201, 6, '2026-06-26 20:02:52', 'Presenta avances, pero aún existen temas que requieren práctica.'),
(7, 47, 3, 1, 1, 4, '', 60, 60, 'En proceso', 6, 4, 10, 83, 7, '2026-06-26 20:22:08', 'Presenta avances, pero aún existen temas que requieren práctica.'),
(8, 48, 3, 1, 1, 4, '', 80, 80, 'Competente', 8, 2, 10, 64, 2, '2026-06-26 20:50:25', 'Buen desempeño. Continúe practicando para consolidar los conocimientos.'),
(9, 49, 3, 1, 1, 4, '', 100, 100, 'Excelente', 10, 0, 10, 66, 0, '2026-06-26 22:45:37', 'Excelente desempeño. Ha demostrado un dominio sólido de los contenidos.'),
(10, 50, 3, 1, 1, 4, '', 100, 100, 'Excelente', 10, 0, 10, 41, 0, '2026-06-26 23:06:09', 'Excelente desempeño. Ha demostrado un dominio sólido de los contenidos.'),
(11, 51, 3, 1, 1, 4, '', 70, 70, 'Competente', 7, 3, 10, 63, 2, '2026-06-27 04:20:51', 'Buen desempeño. Continúe practicando para consolidar los conocimientos.'),
(12, 52, 3, 1, 1, 4, '', 70, 70, 'Competente', 7, 3, 10, 51, 2, '2026-06-27 05:00:11', 'Buen desempeño. Continúe practicando para consolidar los conocimientos.'),
(13, 53, 3, 1, 1, 4, '', 80, 80, 'Competente', 8, 2, 10, 128, 1, '2026-06-27 05:52:12', 'Buen desempeño. Continúe practicando para consolidar los conocimientos.'),
(14, 54, 3, 1, 1, 4, '', 60, 60, 'En proceso', 6, 4, 10, 181, 3, '2026-06-28 02:29:07', 'Presenta avances, pero aún existen temas que requieren práctica.'),
(15, 55, 3, 1, 1, 4, '', 90, 90, 'Excelente', 9, 1, 10, 46, 0, '2026-06-28 17:51:13', 'Excelente desempeño. Ha demostrado un dominio sólido de los contenidos.'),
(16, 56, 3, 1, 1, 4, '', 100, 100, 'Excelente', 10, 0, 10, 52, 0, '2026-06-28 18:04:12', 'Excelente desempeño. Ha demostrado un dominio sólido de los contenidos.'),
(17, 57, 3, 1, 1, 4, '', 100, 100, 'Excelente', 10, 0, 10, 34, 0, '2026-06-28 20:47:16', 'Excelente desempeño. Ha demostrado un dominio sólido de los contenidos.'),
(18, 58, 3, 1, 1, 4, 'Intermedio', 70, 70, 'Competente', 7, 3, 10, 113, 3, '2026-06-29 23:09:30', 'Buen desempeño. Continúe practicando para consolidar los conocimientos.'),
(19, 59, 3, 1, 1, 4, 'Básico', 80, 80, 'Competente', 8, 2, 10, 119, 3, '2026-07-03 23:16:08', 'Buen desempeño. Continúe practicando para consolidar los conocimientos.'),
(20, 60, 3, 1, 1, 4, 'Básico', 60, 60, 'En proceso', 6, 4, 10, 147, 3, '2026-07-06 04:56:01', 'Presenta avances, pero aún existen temas que requieren práctica.'),
(21, 61, 3, 1, 1, 4, 'Básico', 70, 70, 'Competente', 7, 3, 10, 149, 3, '2026-07-07 03:20:48', 'Buen desempeño. Continúe practicando para consolidar los conocimientos.'),
(22, 62, 3, 1, 1, 4, 'Básico', 70, 70, 'Competente', 7, 3, 10, 376, 3, '2026-07-07 14:54:57', 'Buen desempeño. Continúe practicando para consolidar los conocimientos.'),
(23, 63, 3, 1, 1, 4, 'Básico', 80, 80, 'Competente', 8, 2, 10, 106, 3, '2026-07-07 16:55:35', 'Buen desempeño. Continúe practicando para consolidar los conocimientos.'),
(24, 64, 3, 1, 1, 4, 'Básico', 80, 80, 'Competente', 8, 2, 10, 49, 3, '2026-07-07 20:53:01', 'Buen desempeño. Continúe practicando para consolidar los conocimientos.'),
(25, 65, 3, 1, 1, 4, 'Avanzado', 60, 60, 'En proceso', 6, 4, 10, 138, 3, '2026-07-07 21:20:13', 'Presenta avances, pero aún existen temas que requieren práctica.'),
(26, 67, 3, 1, 1, 4, 'Básico', 50, 50, 'En proceso', 5, 5, 10, 359, 3, '2026-07-10 21:32:10', 'Presenta avances, pero aún existen temas que requieren práctica.'),
(27, 68, 3, 1, 1, 4, 'Básico', 100, 100, 'Excelente', 10, 0, 10, 217, 1, '2026-07-10 21:45:28', 'Excelente desempeño. Ha demostrado un dominio sólido de los contenidos.'),
(28, 73, 3, 1, 1, 4, 'Básico', 100, 100, 'Excelente', 10, 0, 10, 66, 2, '2026-07-11 00:07:45', 'Excelente desempeño. Ha demostrado un dominio sólido de los contenidos.'),
(29, 74, 3, 1, 1, 4, 'Básico', 100, 100, 'Excelente', 10, 0, 10, 46, 1, '2026-07-11 06:12:11', 'Excelente desempeño. Ha demostrado un dominio sólido de los contenidos.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultado_detalle`
--

CREATE TABLE `resultado_detalle` (
  `id_detalle` int(11) NOT NULL,
  `id_competencia` int(11) NOT NULL,
  `id_tema` int(11) NOT NULL,
  `id_resultado` int(11) NOT NULL,
  `id_pregunta` int(11) NOT NULL,
  `numero_pregunta` int(11) NOT NULL,
  `respuesta_estudiante` char(1) NOT NULL,
  `respuesta_correcta` char(1) NOT NULL,
  `es_correcta` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `tiempo_respuesta` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(100) NOT NULL,
  `descripcion_rol` text NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre_rol`, `descripcion_rol`, `estado`, `created_at`) VALUES
(1, 'Administrador', 'Control total del sistema', 1, '2026-06-12 17:35:42'),
(2, 'Profesor', 'Gestión académica y preguntas', 1, '2026-06-12 17:35:42'),
(3, 'Estudiante', 'Realiza evaluaciones y consulta resultados', 1, '2026-06-12 17:35:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `submodulos`
--

CREATE TABLE `submodulos` (
  `id_submodulo` int(11) NOT NULL,
  `nombre_submodulo` varchar(100) NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `descripcion_submodulo` text NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `submodulos`
--

INSERT INTO `submodulos` (`id_submodulo`, `nombre_submodulo`, `codigo`, `descripcion_submodulo`, `estado`, `created_at`, `update_at`) VALUES
(1, 'Diagnóstico', 'DIAG', 'Evaluación diagnóstica', 1, '2026-06-12 18:04:54', '2026-06-12 18:04:54'),
(2, 'Refuerzo', 'REF', 'Actividades de refuerzo', 1, '2026-06-12 18:04:54', '2026-06-12 18:04:54'),
(3, 'Fortalecimiento', 'FORT', 'Actividades de fortalecimiento', 1, '2026-06-12 18:04:54', '2026-06-12 18:04:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `temas`
--

CREATE TABLE `temas` (
  `id_tema` int(11) NOT NULL,
  `id_nivel` int(11) NOT NULL,
  `nombre_tema` varchar(200) NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `descripcion_tema` text NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `temas`
--

INSERT INTO `temas` (`id_tema`, `id_nivel`, `nombre_tema`, `codigo`, `descripcion_tema`, `estado`, `created_at`, `update_at`) VALUES
(1, 1, 'Álgebra y Funciones', 'ALG_BACH', 'Álgebra para bachillerato', 1, '2026-06-12 17:38:42', '2026-06-12 17:38:42'),
(2, 1, 'Geometría', 'GEO_BACH', 'Geometría para bachillerato', 1, '2026-06-12 17:38:42', '2026-06-12 17:38:42'),
(3, 1, 'Estadística', 'EST_BACH', 'Estadística para bachillerato', 1, '2026-06-12 17:38:42', '2026-06-12 17:38:42'),
(4, 2, 'Álgebra y Funciones', 'ALG_NIV', 'Álgebra para nivelación', 1, '2026-06-12 17:39:27', '2026-06-12 17:39:27'),
(5, 2, 'Geometría', 'GEO_NIV', 'Geometría para nivelación', 1, '2026-06-12 17:39:27', '2026-06-12 17:39:27'),
(6, 2, 'Estadística', 'EST_NIV', 'Estadística para nivelación', 1, '2026-06-12 17:39:27', '2026-06-12 17:39:27'),
(7, 3, 'Álgebra y Funciones', 'ALG_SEM1', 'Álgebra para primer semestre', 1, '2026-06-12 17:39:51', '2026-06-28 18:51:24'),
(8, 3, 'Geometría', 'CAL_SEM1', 'Geometría para primer semestre', 1, '2026-06-12 17:39:51', '2026-06-28 18:51:50'),
(9, 3, 'Estadística', 'GA_SEM1', 'Estadística para primer semestre', 1, '2026-06-12 17:39:51', '2026-06-28 18:52:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_institucion`
--

CREATE TABLE `tipos_institucion` (
  `id_tipo` int(11) NOT NULL,
  `nombre_tipo` varchar(150) NOT NULL,
  `descripcion_tipo` text NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tipos_institucion`
--

INSERT INTO `tipos_institucion` (`id_tipo`, `nombre_tipo`, `descripcion_tipo`, `estado`, `created_at`, `update_at`) VALUES
(1, 'Pública', 'Institución pública', 1, '2026-06-12 17:36:28', '2026-06-12 17:36:28'),
(2, 'Privada', 'Institución privada', 1, '2026-06-12 17:36:28', '2026-06-12 17:36:28'),
(3, 'Fiscomisional', 'Institución fiscomisional', 1, '2026-06-12 17:36:28', '2026-06-12 17:36:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `videos`
--

CREATE TABLE `videos` (
  `id_video` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `id_tema` int(11) NOT NULL,
  `id_submodulo` int(11) NOT NULL,
  `id_competencia` int(11) NOT NULL,
  `youtube_id` varchar(50) NOT NULL,
  `actualizado_por` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estado` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `descripcion` text DEFAULT NULL,
  `tipo` enum('DIAGNOSTICO','REFUERZO') DEFAULT 'REFUERZO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `videos`
--

INSERT INTO `videos` (`id_video`, `titulo`, `id_tema`, `id_submodulo`, `id_competencia`, `youtube_id`, `actualizado_por`, `updated_at`, `estado`, `created_at`, `descripcion`, `tipo`) VALUES
(2, '5 tipos de demostraciones matemáticas que debes conocer', 4, 1, 1, 'TgCQk3c7eeU', 3, '2026-07-05 19:13:39', 1, '2026-07-05 17:37:58', 'razonamiento y demostracion', 'DIAGNOSTICO'),
(3, 'Claves para plantear problemas matemáticos #julioprofe', 4, 1, 1, 'EYG1XvNUZF0', 3, '2026-07-05 20:01:40', 1, '2026-07-05 20:01:40', 'problemas matematicos', 'DIAGNOSTICO'),
(4, 'Dominios de diferentes funciones #julioprofe', 4, 1, 1, 'qOCMPXoxJyg', 3, '2026-07-05 20:18:25', 1, '2026-07-05 20:18:25', 'funciones', 'DIAGNOSTICO'),
(5, 'PUNTO MEDIO DE UN SEGMENTO - DEMOSTRACIÓN', 5, 1, 1, 'EnpPmpmEEUA', 3, '2026-07-06 05:05:23', 1, '2026-07-06 05:05:23', 'geometria demostracion', 'DIAGNOSTICO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `videos_estudiantes`
--

CREATE TABLE `videos_estudiantes` (
  `id_video_estudiante` int(11) NOT NULL,
  `id_estudiante` int(11) NOT NULL,
  `id_video` int(11) NOT NULL,
  `visto_completo` tinyint(1) NOT NULL DEFAULT 0,
  `omitido` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_visualizacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `videos_estudiantes`
--

INSERT INTO `videos_estudiantes` (`id_video_estudiante`, `id_estudiante`, `id_video`, `visto_completo`, `omitido`, `fecha_visualizacion`) VALUES
(1, 3, 2, 1, 0, '2026-07-05 18:03:26'),
(2, 3, 3, 0, 1, '2026-07-05 18:03:46'),
(3, 3, 4, 1, 0, '2026-07-05 23:53:33'),
(4, 3, 2, 1, 0, '2026-07-06 22:18:18'),
(5, 3, 2, 1, 0, '2026-07-07 09:48:40'),
(6, 3, 3, 1, 0, '2026-07-07 11:53:48'),
(7, 3, 2, 0, 1, '2026-07-07 15:52:11'),
(8, 3, 4, 0, 1, '2026-07-07 16:17:55'),
(9, 3, 4, 0, 1, '2026-07-10 15:34:42'),
(10, 3, 2, 0, 1, '2026-07-10 16:21:38'),
(11, 3, 2, 0, 1, '2026-07-10 16:38:38'),
(12, 3, 4, 0, 1, '2026-07-10 18:40:57'),
(13, 3, 3, 0, 1, '2026-07-10 18:53:45'),
(14, 3, 4, 0, 1, '2026-07-11 01:11:24');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `correo_admin` (`correo_admin`),
  ADD KEY `fk_admin_rol` (`id_rol`);

--
-- Indices de la tabla `carreras`
--
ALTER TABLE `carreras`
  ADD PRIMARY KEY (`id_carrera`);

--
-- Indices de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD PRIMARY KEY (`id_ciudad`),
  ADD KEY `fk_ciudad_provincia` (`id_provincia`);

--
-- Indices de la tabla `competencias`
--
ALTER TABLE `competencias`
  ADD PRIMARY KEY (`id_competencia`);

--
-- Indices de la tabla `configuracion_quiz`
--
ALTER TABLE `configuracion_quiz`
  ADD PRIMARY KEY (`id_configuracion`),
  ADD KEY `fk_configuracion_profesor` (`id_profesor`),
  ADD KEY `fk_configuracion_competencia` (`id_competencia`),
  ADD KEY `fk_configuracion_submodulo` (`id_submodulo`),
  ADD KEY `fk_configuracion_tema` (`id_tema`);

--
-- Indices de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD PRIMARY KEY (`id_estudiante`),
  ADD UNIQUE KEY `correo_estudiante` (`correo_estudiante`),
  ADD KEY `fk_estudiante_nivel` (`id_nivel`),
  ADD KEY `fk_estudiante_tipo` (`id_tipo_institucion`),
  ADD KEY `fk_estudiante_carrera` (`id_carrera`),
  ADD KEY `fk_estudiante_ciudad` (`id_ciudad`),
  ADD KEY `fk_estudiante_rol` (`id_rol`),
  ADD KEY `fk_estudiante_periodo` (`id_periodo`);

--
-- Indices de la tabla `estudiante_submodulo`
--
ALTER TABLE `estudiante_submodulo`
  ADD PRIMARY KEY (`id_estudiante_submodulo`),
  ADD KEY `id_estudiante` (`id_estudiante`),
  ADD KEY `id_competencia` (`id_competencia`),
  ADD KEY `id_submodulo` (`id_submodulo`);

--
-- Indices de la tabla `intentos_detalle`
--
ALTER TABLE `intentos_detalle`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `fk_intentosdetalle_quiz` (`id_intento`),
  ADD KEY `fk_intentosdetalle_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `intentos_quiz`
--
ALTER TABLE `intentos_quiz`
  ADD PRIMARY KEY (`id_intento`),
  ADD KEY `fk_intentoquiz_estudiante` (`id_estudiante`),
  ADD KEY `fk_intentoquiz_competencia` (`id_competencia`),
  ADD KEY `fk_intentoquiz_submodulo` (`id_submodulo`),
  ADD KEY `fk_intentoquiz_tema` (`id_tema`);

--
-- Indices de la tabla `niveles_educativos`
--
ALTER TABLE `niveles_educativos`
  ADD PRIMARY KEY (`id_nivel`);

--
-- Indices de la tabla `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id_password`);

--
-- Indices de la tabla `periodos_academicos`
--
ALTER TABLE `periodos_academicos`
  ADD PRIMARY KEY (`id_periodo`),
  ADD KEY `fk_periodo_nivel` (`id_nivel`);

--
-- Indices de la tabla `preguntas_competencias`
--
ALTER TABLE `preguntas_competencias`
  ADD PRIMARY KEY (`id_pregunta`),
  ADD KEY `fk_pregunta_competencia` (`id_competencia`),
  ADD KEY `fk_pregunta_tema` (`id_tema`),
  ADD KEY `fk_pregunta_submodulo` (`id_submodulo`),
  ADD KEY `fk_pregunta_profesor` (`id_profesor`),
  ADD KEY `fk_pregunta_nivel` (`id_nivel`);

--
-- Indices de la tabla `profesores`
--
ALTER TABLE `profesores`
  ADD PRIMARY KEY (`id_profesor`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `fk_profesor_nivel` (`id_nivel`),
  ADD KEY `fk_profesor_tipo` (`id_tipo_institucion`),
  ADD KEY `fk_profesor_carrera` (`id_carrera`),
  ADD KEY `fk_profesor_provincia` (`id_provincia`),
  ADD KEY `fk_profesor_ciudad` (`id_ciudad`),
  ADD KEY `fk_profesor_rol` (`id_rol`);

--
-- Indices de la tabla `provincia`
--
ALTER TABLE `provincia`
  ADD PRIMARY KEY (`id_provincia`);

--
-- Indices de la tabla `resultados_quiz`
--
ALTER TABLE `resultados_quiz`
  ADD PRIMARY KEY (`id_resultado`),
  ADD KEY `fk_resultado_estudiante` (`id_estudiante`),
  ADD KEY `fk_resultado_competencia` (`id_competencia`),
  ADD KEY `fk_resultado_submodulo` (`id_submodulo`),
  ADD KEY `fk_resultado_tema` (`id_tema`),
  ADD KEY `fk_resultado_intento` (`id_intento`);

--
-- Indices de la tabla `resultado_detalle`
--
ALTER TABLE `resultado_detalle`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `fk_detalle_resultado` (`id_resultado`),
  ADD KEY `fk_detalle_pregunta` (`id_pregunta`),
  ADD KEY `fk_detalle_competencia` (`id_competencia`),
  ADD KEY `fk_detalle_tema` (`id_tema`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `submodulos`
--
ALTER TABLE `submodulos`
  ADD PRIMARY KEY (`id_submodulo`);

--
-- Indices de la tabla `temas`
--
ALTER TABLE `temas`
  ADD PRIMARY KEY (`id_tema`),
  ADD KEY `fk_tema_nivel` (`id_nivel`);

--
-- Indices de la tabla `tipos_institucion`
--
ALTER TABLE `tipos_institucion`
  ADD PRIMARY KEY (`id_tipo`);

--
-- Indices de la tabla `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id_video`),
  ADD KEY `fk_video_tema` (`id_tema`),
  ADD KEY `fk_video_competencia` (`id_competencia`),
  ADD KEY `fk_video_submodulo` (`id_submodulo`);

--
-- Indices de la tabla `videos_estudiantes`
--
ALTER TABLE `videos_estudiantes`
  ADD PRIMARY KEY (`id_video_estudiante`),
  ADD KEY `fk_video_estudiante` (`id_estudiante`),
  ADD KEY `fk_video` (`id_video`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `administrador`
--
ALTER TABLE `administrador`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `carreras`
--
ALTER TABLE `carreras`
  MODIFY `id_carrera` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  MODIFY `id_ciudad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `competencias`
--
ALTER TABLE `competencias`
  MODIFY `id_competencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `configuracion_quiz`
--
ALTER TABLE `configuracion_quiz`
  MODIFY `id_configuracion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  MODIFY `id_estudiante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `estudiante_submodulo`
--
ALTER TABLE `estudiante_submodulo`
  MODIFY `id_estudiante_submodulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `intentos_detalle`
--
ALTER TABLE `intentos_detalle`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=371;

--
-- AUTO_INCREMENT de la tabla `intentos_quiz`
--
ALTER TABLE `intentos_quiz`
  MODIFY `id_intento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT de la tabla `niveles_educativos`
--
ALTER TABLE `niveles_educativos`
  MODIFY `id_nivel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id_password` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `periodos_academicos`
--
ALTER TABLE `periodos_academicos`
  MODIFY `id_periodo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `preguntas_competencias`
--
ALTER TABLE `preguntas_competencias`
  MODIFY `id_pregunta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT de la tabla `profesores`
--
ALTER TABLE `profesores`
  MODIFY `id_profesor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `provincia`
--
ALTER TABLE `provincia`
  MODIFY `id_provincia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `resultados_quiz`
--
ALTER TABLE `resultados_quiz`
  MODIFY `id_resultado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `resultado_detalle`
--
ALTER TABLE `resultado_detalle`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `submodulos`
--
ALTER TABLE `submodulos`
  MODIFY `id_submodulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `temas`
--
ALTER TABLE `temas`
  MODIFY `id_tema` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `tipos_institucion`
--
ALTER TABLE `tipos_institucion`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `videos`
--
ALTER TABLE `videos`
  MODIFY `id_video` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `videos_estudiantes`
--
ALTER TABLE `videos_estudiantes`
  MODIFY `id_video_estudiante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD CONSTRAINT `fk_admin_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);

--
-- Filtros para la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD CONSTRAINT `fk_ciudad_provincia` FOREIGN KEY (`id_provincia`) REFERENCES `provincia` (`id_provincia`);

--
-- Filtros para la tabla `configuracion_quiz`
--
ALTER TABLE `configuracion_quiz`
  ADD CONSTRAINT `fk_configuracion_competencia` FOREIGN KEY (`id_competencia`) REFERENCES `competencias` (`id_competencia`),
  ADD CONSTRAINT `fk_configuracion_profesor` FOREIGN KEY (`id_profesor`) REFERENCES `profesores` (`id_profesor`),
  ADD CONSTRAINT `fk_configuracion_submodulo` FOREIGN KEY (`id_submodulo`) REFERENCES `submodulos` (`id_submodulo`),
  ADD CONSTRAINT `fk_configuracion_tema` FOREIGN KEY (`id_tema`) REFERENCES `temas` (`id_tema`);

--
-- Filtros para la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD CONSTRAINT `fk_estudiante_carrera` FOREIGN KEY (`id_carrera`) REFERENCES `carreras` (`id_carrera`),
  ADD CONSTRAINT `fk_estudiante_ciudad` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudades` (`id_ciudad`),
  ADD CONSTRAINT `fk_estudiante_nivel` FOREIGN KEY (`id_nivel`) REFERENCES `niveles_educativos` (`id_nivel`),
  ADD CONSTRAINT `fk_estudiante_periodo` FOREIGN KEY (`id_periodo`) REFERENCES `periodos_academicos` (`id_periodo`),
  ADD CONSTRAINT `fk_estudiante_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`),
  ADD CONSTRAINT `fk_estudiante_tipo` FOREIGN KEY (`id_tipo_institucion`) REFERENCES `tipos_institucion` (`id_tipo`);

--
-- Filtros para la tabla `estudiante_submodulo`
--
ALTER TABLE `estudiante_submodulo`
  ADD CONSTRAINT `estudiante_submodulo_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id_estudiante`),
  ADD CONSTRAINT `estudiante_submodulo_ibfk_2` FOREIGN KEY (`id_competencia`) REFERENCES `competencias` (`id_competencia`),
  ADD CONSTRAINT `estudiante_submodulo_ibfk_3` FOREIGN KEY (`id_submodulo`) REFERENCES `submodulos` (`id_submodulo`);

--
-- Filtros para la tabla `intentos_detalle`
--
ALTER TABLE `intentos_detalle`
  ADD CONSTRAINT `fk_intentosdetalle_pregunta` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas_competencias` (`id_pregunta`),
  ADD CONSTRAINT `fk_intentosdetalle_quiz` FOREIGN KEY (`id_intento`) REFERENCES `intentos_quiz` (`id_intento`);

--
-- Filtros para la tabla `intentos_quiz`
--
ALTER TABLE `intentos_quiz`
  ADD CONSTRAINT `fk_intentoquiz_competencia` FOREIGN KEY (`id_competencia`) REFERENCES `competencias` (`id_competencia`),
  ADD CONSTRAINT `fk_intentoquiz_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id_estudiante`),
  ADD CONSTRAINT `fk_intentoquiz_submodulo` FOREIGN KEY (`id_submodulo`) REFERENCES `submodulos` (`id_submodulo`),
  ADD CONSTRAINT `fk_intentoquiz_tema` FOREIGN KEY (`id_tema`) REFERENCES `temas` (`id_tema`);

--
-- Filtros para la tabla `periodos_academicos`
--
ALTER TABLE `periodos_academicos`
  ADD CONSTRAINT `fk_periodo_nivel` FOREIGN KEY (`id_nivel`) REFERENCES `niveles_educativos` (`id_nivel`);

--
-- Filtros para la tabla `preguntas_competencias`
--
ALTER TABLE `preguntas_competencias`
  ADD CONSTRAINT `fk_pregunta_competencia` FOREIGN KEY (`id_competencia`) REFERENCES `competencias` (`id_competencia`),
  ADD CONSTRAINT `fk_pregunta_nivel` FOREIGN KEY (`id_nivel`) REFERENCES `niveles_educativos` (`id_nivel`),
  ADD CONSTRAINT `fk_pregunta_profesor` FOREIGN KEY (`id_profesor`) REFERENCES `profesores` (`id_profesor`),
  ADD CONSTRAINT `fk_pregunta_submodulo` FOREIGN KEY (`id_submodulo`) REFERENCES `submodulos` (`id_submodulo`),
  ADD CONSTRAINT `fk_pregunta_tema` FOREIGN KEY (`id_tema`) REFERENCES `temas` (`id_tema`);

--
-- Filtros para la tabla `profesores`
--
ALTER TABLE `profesores`
  ADD CONSTRAINT `fk_profesor_carrera` FOREIGN KEY (`id_carrera`) REFERENCES `carreras` (`id_carrera`),
  ADD CONSTRAINT `fk_profesor_ciudad` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudades` (`id_ciudad`),
  ADD CONSTRAINT `fk_profesor_nivel` FOREIGN KEY (`id_nivel`) REFERENCES `niveles_educativos` (`id_nivel`),
  ADD CONSTRAINT `fk_profesor_provincia` FOREIGN KEY (`id_provincia`) REFERENCES `provincia` (`id_provincia`),
  ADD CONSTRAINT `fk_profesor_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`),
  ADD CONSTRAINT `fk_profesor_tipo` FOREIGN KEY (`id_tipo_institucion`) REFERENCES `tipos_institucion` (`id_tipo`);

--
-- Filtros para la tabla `resultados_quiz`
--
ALTER TABLE `resultados_quiz`
  ADD CONSTRAINT `fk_resultado_competencia` FOREIGN KEY (`id_competencia`) REFERENCES `competencias` (`id_competencia`),
  ADD CONSTRAINT `fk_resultado_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id_estudiante`),
  ADD CONSTRAINT `fk_resultado_intento` FOREIGN KEY (`id_intento`) REFERENCES `intentos_quiz` (`id_intento`),
  ADD CONSTRAINT `fk_resultado_submodulo` FOREIGN KEY (`id_submodulo`) REFERENCES `submodulos` (`id_submodulo`),
  ADD CONSTRAINT `fk_resultado_tema` FOREIGN KEY (`id_tema`) REFERENCES `temas` (`id_tema`);

--
-- Filtros para la tabla `resultado_detalle`
--
ALTER TABLE `resultado_detalle`
  ADD CONSTRAINT `fk_detalle_competencia` FOREIGN KEY (`id_competencia`) REFERENCES `competencias` (`id_competencia`),
  ADD CONSTRAINT `fk_detalle_pregunta` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas_competencias` (`id_pregunta`),
  ADD CONSTRAINT `fk_detalle_resultado` FOREIGN KEY (`id_resultado`) REFERENCES `resultados_quiz` (`id_resultado`),
  ADD CONSTRAINT `fk_detalle_tema` FOREIGN KEY (`id_tema`) REFERENCES `temas` (`id_tema`);

--
-- Filtros para la tabla `temas`
--
ALTER TABLE `temas`
  ADD CONSTRAINT `fk_tema_nivel` FOREIGN KEY (`id_nivel`) REFERENCES `niveles_educativos` (`id_nivel`);

--
-- Filtros para la tabla `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `fk_video_competencia` FOREIGN KEY (`id_competencia`) REFERENCES `competencias` (`id_competencia`),
  ADD CONSTRAINT `fk_video_submodulo` FOREIGN KEY (`id_submodulo`) REFERENCES `submodulos` (`id_submodulo`),
  ADD CONSTRAINT `fk_video_tema` FOREIGN KEY (`id_tema`) REFERENCES `temas` (`id_tema`);

--
-- Filtros para la tabla `videos_estudiantes`
--
ALTER TABLE `videos_estudiantes`
  ADD CONSTRAINT `fk_video` FOREIGN KEY (`id_video`) REFERENCES `videos` (`id_video`),
  ADD CONSTRAINT `fk_video_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id_estudiante`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
