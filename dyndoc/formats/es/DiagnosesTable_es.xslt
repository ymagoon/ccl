<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions">

    <!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/diagnosestable.xslt"/>
    <!-- Uncomment this line to debug  <xsl:import href="../diagnosestable.xslt" /> -->
    <!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/es/dateformat_es.xslt"/>
    <!-- Uncomment this line to debug <xsl:import href="./dateformat_es.xslt" /> -->
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
    <xsl:param as="xs:string" name="current-locale" select="'es'"/>

    <!-- Strings defined for DiagnosesTable.xslt, String values defined here override the default values defined in DiagnosesTable.xslt -->
    <xsl:variable name="diagnosisHeading" as="xs:string" select="'Diagn&#243;stico'"/>
    <xsl:variable name="typeHeading" as="xs:string" select="'Tipo'"/>
    <xsl:variable name="diagnosisDateHeading" as="xs:string" select="'Fecha de diagn&#243;stico'"/>
    <xsl:variable name="qualifierHeading" as="xs:string" select="'Calificador'"/>
    <xsl:variable name="clinicalServiceHeading" as="xs:string" select="'Servicio cl&#237;nico'"/>
    <xsl:variable name="sourceHeading" as="xs:string" select="'Origen'"/>
    <xsl:variable name="commentHeading" as="xs:string" select="'Comentarios'"/>

</xsl:stylesheet>
