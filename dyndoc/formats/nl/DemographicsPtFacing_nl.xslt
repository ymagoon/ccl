<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    exclude-result-prefixes="xsl xs fn n">
    <!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/demographicsptfacing.xslt"/>
    <!-- Uncomment this line to debug <xsl:import href="../demographicsptfacing.xslt" /> -->
    <!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/nl/dateformat_nl.xslt"/>
    <!-- Uncomment this line to debug <xsl:import href="./dateformat_nl.xslt" /> -->
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
    <xsl:param as="xs:string" name="current-locale" select="'nl'"/>

    <!-- Strings defined for demographicsptfacing.xslt, String values defined here override the default values defined in demographicsptfacing.xslt -->
    <xsl:variable name="DOB" as="xs:string">
        <xsl:value-of select="'Geboortedatum:'"/>
    </xsl:variable>

    <xsl:variable name="MRN" as="xs:string">
        <xsl:value-of select="'Pati&#235;ntennummer:'"/>
    </xsl:variable>

    <xsl:variable name="RegDtTm" as="xs:string">
        <xsl:value-of select="'Datum bezoek:'"/>
    </xsl:variable>

</xsl:stylesheet>