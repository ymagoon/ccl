<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
    xmlns:dd="DynamicDocumentation"
    exclude-result-prefixes="xsl xs fn n cdocfx">

    <!-- Comment this line to debug--> <xsl:import href="/cernerbasiccontent/formats/healthstatustable.xslt"/>
    <!-- Uncomment this line to debug <xsl:import href="../healthstatustable.xslt" /> -->
    <!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/fr/dateformat_fr.xslt"/>
    <!-- Uncomment this line to debug <xsl:import href="./dateformat_fr.xslt" /> -->

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:param as="xs:string" name="current-locale" select="'fr'"/>

    <!-- Strings defined for patcaremeasurementstable.xslt, String values defined here override the default values defined in patcaremeasurementstable.xslt -->
    <xsl:variable name="measValueUnit" as="xs:string" select="'%s %s'"/>
    <xsl:variable name="measValueInterpretation" as="xs:string" select="'%s %s'" />

    <xsl:variable name="NormalHigh" as="xs:string">
        <xsl:value-of select="'(&#201;lev&#233;)'"/>
    </xsl:variable>

    <xsl:variable name="NormalLow" as="xs:string">
        <xsl:value-of select="'(Faible)'"/>
    </xsl:variable>

    <xsl:variable name="Critical" as="xs:string">
        <xsl:value-of select="'(Critique)'"/>
    </xsl:variable>

    <xsl:variable name="Abnormal" as="xs:string">
        <xsl:value-of select="'(Anormal)'"/>
    </xsl:variable>

    <xsl:variable name="HealthStatusHeading" as="xs:string">
        <xsl:value-of select="'&#201;tat de sant&#233; g&#233;n&#233;ral'"/>
    </xsl:variable>

    <xsl:variable name="DateHeading" as="xs:string">
        <xsl:value-of select="'Date document&#233;e'"/>
    </xsl:variable>

</xsl:stylesheet>
