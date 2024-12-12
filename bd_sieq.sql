-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-12-2024 a las 04:43:25
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_sieq`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `emergencia`
--

CREATE TABLE `emergencia` (
  `id_emergencia` int(50) NOT NULL,
  `gato` varchar(8) DEFAULT NULL,
  `llave` varchar(8) DEFAULT NULL,
  `triangulo` varchar(8) DEFAULT NULL,
  `llanta_refaccion` varchar(8) DEFAULT NULL,
  `extintor` varchar(8) DEFAULT NULL,
  `torreta` varchar(8) DEFAULT NULL,
  `calzas` varchar(8) DEFAULT NULL,
  `cables` varchar(8) DEFAULT NULL,
  `matachispas` varchar(8) DEFAULT NULL,
  `botiquin` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `emergencia`
--

INSERT INTO `emergencia` (`id_emergencia`, `gato`, `llave`, `triangulo`, `llanta_refaccion`, `extintor`, `torreta`, `calzas`, `cables`, `matachispas`, `botiquin`) VALUES
(1, 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene'),
(2, 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene'),
(3, 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene'),
(4, 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene', 'tiene');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evidencias`
--

CREATE TABLE `evidencias` (
  `id_evidencia` int(50) NOT NULL,
  `ruta_imagen` varchar(255) NOT NULL,
  `id_formulario_fk` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `evidencias`
--

INSERT INTO `evidencias` (`id_evidencia`, `ruta_imagen`, `id_formulario_fk`) VALUES
(1, 'C:\\fakepath\\imagen5.jpg', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `exteriores`
--

CREATE TABLE `exteriores` (
  `id_exteriores` int(50) NOT NULL,
  `luces` varchar(5) DEFAULT NULL,
  `luces_cuarto` varchar(5) DEFAULT NULL,
  `antena` varchar(5) DEFAULT NULL,
  `espejos_retractiles` varchar(5) DEFAULT NULL,
  `espejos_laterales` varchar(5) DEFAULT NULL,
  `cristales` varchar(5) DEFAULT NULL,
  `rotulos` varchar(5) DEFAULT NULL,
  `tapones_rines` varchar(5) DEFAULT NULL,
  `tapon_combustible` varchar(5) DEFAULT NULL,
  `claxon` varchar(5) DEFAULT NULL,
  `limpiaparabrisas` varchar(5) DEFAULT NULL,
  `manijas` varchar(5) DEFAULT NULL,
  `fascias` varchar(5) DEFAULT NULL,
  `limpieza_unidad` varchar(5) DEFAULT NULL,
  `llantas` varchar(5) DEFAULT NULL,
  `alarma_reversa` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `exteriores`
--

INSERT INTO `exteriores` (`id_exteriores`, `luces`, `luces_cuarto`, `antena`, `espejos_retractiles`, `espejos_laterales`, `cristales`, `rotulos`, `tapones_rines`, `tapon_combustible`, `claxon`, `limpiaparabrisas`, `manijas`, `fascias`, `limpieza_unidad`, `llantas`, `alarma_reversa`) VALUES
(1, 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien'),
(2, 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien'),
(3, 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien'),
(4, 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formulario`
--

CREATE TABLE `formulario` (
  `id_formulario` int(50) NOT NULL,
  `folio` int(5) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora_registro` time DEFAULT NULL,
  `kilometraje` decimal(10,3) NOT NULL,
  `destino` varchar(255) NOT NULL,
  `licen_conducir` varchar(4) NOT NULL,
  `t_circulacion` varchar(4) NOT NULL,
  `poliza` varchar(4) NOT NULL,
  `vvq` varchar(4) NOT NULL,
  `id_vehiculo_fk` int(50) DEFAULT NULL,
  `id_niveles_fk` int(50) DEFAULT NULL,
  `id_interiores_fk` int(50) DEFAULT NULL,
  `id_exteriores_fk` int(50) DEFAULT NULL,
  `id_emergencia_fk` int(50) DEFAULT NULL,
  `id_extra_fk` int(50) DEFAULT NULL,
  `conductor` varchar(255) NOT NULL,
  `fir_recibe_vehiculo` varchar(255) NOT NULL,
  `fir_elaboro_vehiculo` text NOT NULL,
  `estado` enum('Pendiente','Completo') DEFAULT NULL,
  `tipo_registro` enum('Salida','Entrada') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `formulario`
--

INSERT INTO `formulario` (`id_formulario`, `folio`, `fecha`, `hora_registro`, `kilometraje`, `destino`, `licen_conducir`, `t_circulacion`, `poliza`, `vvq`, `id_vehiculo_fk`, `id_niveles_fk`, `id_interiores_fk`, `id_exteriores_fk`, `id_emergencia_fk`, `id_extra_fk`, `conductor`, `fir_recibe_vehiculo`, `fir_elaboro_vehiculo`, `estado`, `tipo_registro`) VALUES
(1, 1, '2024-10-30', '00:26:35', '12.000', 'Actopan', 'bien', 'bien', 'bien', 'bien', 1, 1, 1, 1, 1, 1, 'Rigoberto Zarate Hernández', 'Gelasio Aguilar Santos', 'Rigoberto Zarate Hernández ', 'Pendiente', 'Salida'),
(2, 2, '2024-10-30', '00:26:35', '12.000', 'Actopan', 'bien', 'bien', 'bien', 'bien', 1, 1, 1, 1, 1, 1, 'Rigoberto Zarate Hernández', 'Gelasio Aguilar Santos', 'Rigoberto Zarate Hernández ', 'Pendiente', 'Salida'),
(3, 2, '2024-12-12', '21:33:00', '25.000', 'SIEQ', 'bien', 'bien', 'bien', 'bien', 1, 4, 4, 4, 4, 4, 'Rigoberto Zarate Hernández', 'Rigoberto Zarate Hernández', 'Gelasio Aguilar Santos ', 'Completo', 'Entrada');

--
-- Disparadores `formulario`
--
DELIMITER $$
CREATE TRIGGER `before_insert_formulario` BEFORE INSERT ON `formulario` FOR EACH ROW BEGIN
    DECLARE max_folio INT;

    -- Verifica si el campo `folio` está vacío (NULL o valor vacío)
    IF NEW.folio IS NULL OR NEW.folio = '' THEN
        -- Obtiene el valor máximo de `folio` o 0 si no hay registros
        SELECT IFNULL(MAX(folio), 0) INTO max_folio FROM Formulario;
        
        -- Asigna el siguiente valor de `folio` con ceros al frente
        SET NEW.folio = LPAD(max_folio + 1, 5, '0');
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `interiores`
--

CREATE TABLE `interiores` (
  `id_interiores` int(50) NOT NULL,
  `tablero` varchar(5) DEFAULT NULL,
  `calefaccion` varchar(5) DEFAULT NULL,
  `estereo` varchar(5) DEFAULT NULL,
  `bocinas` varchar(5) DEFAULT NULL,
  `viseras` varchar(5) DEFAULT NULL,
  `retrovisor` varchar(5) DEFAULT NULL,
  `cenicero` varchar(5) DEFAULT NULL,
  `botones` varchar(5) DEFAULT NULL,
  `manijas` varchar(5) DEFAULT NULL,
  `tapetes` varchar(5) DEFAULT NULL,
  `vestiduras` varchar(5) DEFAULT NULL,
  `cielo` varchar(5) DEFAULT NULL,
  `asientos` varchar(5) DEFAULT NULL,
  `cinturones` varchar(5) DEFAULT NULL,
  `libre_olores` varchar(5) DEFAULT NULL,
  `matrial_ageno` varchar(5) DEFAULT NULL,
  `libre_basura` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `interiores`
--

INSERT INTO `interiores` (`id_interiores`, `tablero`, `calefaccion`, `estereo`, `bocinas`, `viseras`, `retrovisor`, `cenicero`, `botones`, `manijas`, `tapetes`, `vestiduras`, `cielo`, `asientos`, `cinturones`, `libre_olores`, `matrial_ageno`, `libre_basura`) VALUES
(1, 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien'),
(2, 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien'),
(3, 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien'),
(4, 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien', 'bien');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `niveles`
--

CREATE TABLE `niveles` (
  `id_niveles` int(50) NOT NULL,
  `aceite_motor` varchar(4) DEFAULT NULL,
  `anticongelante` varchar(4) DEFAULT NULL,
  `estado_frenos` varchar(4) DEFAULT NULL,
  `liquido_frenos` varchar(4) DEFAULT NULL,
  `liq_limpiaparabrisas` varchar(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `niveles`
--

INSERT INTO `niveles` (`id_niveles`, `aceite_motor`, `anticongelante`, `estado_frenos`, `liquido_frenos`, `liq_limpiaparabrisas`) VALUES
(1, 'bien', 'bien', 'bien', 'bien', 'bien'),
(2, 'bien', 'bien', 'bien', 'bien', 'bien'),
(3, 'bien', 'bien', 'bien', 'bien', 'bien'),
(4, 'bien', 'bien', 'bien', 'bien', 'bien');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `revicion_extra`
--

CREATE TABLE `revicion_extra` (
  `id_extra` int(50) NOT NULL,
  `nivel_combustible` decimal(5,2) DEFAULT NULL,
  `vida_llantas_delanteras` int(11) DEFAULT NULL,
  `presion_delanteras` int(11) DEFAULT NULL,
  `vida_llantas_traseras` int(11) DEFAULT NULL,
  `presion_traseras` int(11) DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `revicion_extra`
--

INSERT INTO `revicion_extra` (`id_extra`, `nivel_combustible`, `vida_llantas_delanteras`, `presion_delanteras`, `vida_llantas_traseras`, `presion_traseras`, `observaciones`) VALUES
(1, '51.00', 12, 12, 12, 12, NULL),
(2, '48.00', 12, 12, 12, 12, NULL),
(3, '45.00', 12, 12, 12, 12, NULL),
(4, '51.00', 12, 12, 12, 12, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(50) NOT NULL,
  `no_empleado` varchar(50) DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `ape_paterno` varchar(50) DEFAULT NULL,
  `ape_materno` varchar(50) DEFAULT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `rol` enum('administrador','tecnico','trabajador') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `no_empleado`, `nombre`, `ape_paterno`, `ape_materno`, `usuario`, `password`, `rol`) VALUES
(1, '12SIEQ18', 'Xitlali', 'Pérez', 'Pérez', 'AdminX', 'Adminsieq18', 'administrador'),
(2, '13SIEQ19', 'Gelasio', 'Aguilar', 'Santos', 'TecniG', 'TecniSieq1', 'tecnico'),
(3, '14SIEQ20', 'Seguridad', 'No aplica', 'No aplica', 'TrabaS', 'TrabaUno', 'trabajador'),
(12, '17SIEQ22', 'Edgar', 'Jimenez', 'Merino', 'AdminUno', 'AdminsieqE', 'administrador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculo`
--

CREATE TABLE `vehiculo` (
  `id_vehiculo` int(50) NOT NULL,
  `no_unidad` varchar(5) NOT NULL,
  `tipo` varchar(20) DEFAULT NULL,
  `placas` varchar(10) DEFAULT NULL,
  `year` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vehiculo`
--

INSERT INTO `vehiculo` (`id_vehiculo`, `no_unidad`, `tipo`, `placas`, `year`) VALUES
(1, '01', 'Virtus', 'DEF-5678', 2015);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `emergencia`
--
ALTER TABLE `emergencia`
  ADD PRIMARY KEY (`id_emergencia`);

--
-- Indices de la tabla `evidencias`
--
ALTER TABLE `evidencias`
  ADD PRIMARY KEY (`id_evidencia`),
  ADD KEY `id_formulario_fk` (`id_formulario_fk`);

--
-- Indices de la tabla `exteriores`
--
ALTER TABLE `exteriores`
  ADD PRIMARY KEY (`id_exteriores`);

--
-- Indices de la tabla `formulario`
--
ALTER TABLE `formulario`
  ADD PRIMARY KEY (`id_formulario`),
  ADD KEY `id_vehiculo_fk` (`id_vehiculo_fk`),
  ADD KEY `id_niveles_fk` (`id_niveles_fk`),
  ADD KEY `id_exteriores_fk` (`id_exteriores_fk`),
  ADD KEY `id_interiores_fk` (`id_interiores_fk`),
  ADD KEY `id_emergencia_fk` (`id_emergencia_fk`),
  ADD KEY `id_extra_fk` (`id_extra_fk`);

--
-- Indices de la tabla `interiores`
--
ALTER TABLE `interiores`
  ADD PRIMARY KEY (`id_interiores`);

--
-- Indices de la tabla `niveles`
--
ALTER TABLE `niveles`
  ADD PRIMARY KEY (`id_niveles`);

--
-- Indices de la tabla `revicion_extra`
--
ALTER TABLE `revicion_extra`
  ADD PRIMARY KEY (`id_extra`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `no_empleado` (`no_empleado`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- Indices de la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  ADD PRIMARY KEY (`id_vehiculo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `emergencia`
--
ALTER TABLE `emergencia`
  MODIFY `id_emergencia` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `evidencias`
--
ALTER TABLE `evidencias`
  MODIFY `id_evidencia` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `exteriores`
--
ALTER TABLE `exteriores`
  MODIFY `id_exteriores` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `formulario`
--
ALTER TABLE `formulario`
  MODIFY `id_formulario` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `interiores`
--
ALTER TABLE `interiores`
  MODIFY `id_interiores` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `niveles`
--
ALTER TABLE `niveles`
  MODIFY `id_niveles` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `revicion_extra`
--
ALTER TABLE `revicion_extra`
  MODIFY `id_extra` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  MODIFY `id_vehiculo` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
