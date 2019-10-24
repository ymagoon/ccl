<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    exclude-result-prefixes="xsl xs fn">

    <!-- Comment this line to debug--> <xsl:import href="/cernerbasiccontent/formats/futureappts.xslt"/>
    <!-- Uncomment this line to debug <xsl:import href="../FutureAppts.xslt"/> -->
    <!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/de/dateformat_de.xslt"/>
    <!-- Uncomment this line to debug <xsl:import href="./dateformat_de.xslt" /> -->
    <!-- Comment out this line to debug--> <xsl:include href="/cernerbasiccontent/formats/de/addressfxn_de.xslt"/>
    <!-- Uncomment this line to debug <xsl:include href="AddressFxn_de.xslt.xslt"/> -->

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:param as="xs:string" name="current-locale" select="'de'"/>

    <!-- Default string constants -->
    <xsl:variable name="Type">
        <xsl:value-of select="'Termintyp'"/>
    </xsl:variable>

    <xsl:variable name="When" as="xs:string">
        <xsl:value-of select="'Wenn'"/>
    </xsl:variable>

    <xsl:variable name="With" as="xs:string">
        <xsl:value-of select="'Mit'"/>
    </xsl:variable>

    <xsl:variable name="Where" as="xs:string">
        <xsl:value-of select="'Wo'"/>
    </xsl:variable>

    <xsl:variable name="Contact" as="xs:string">
        <xsl:value-of select="'Kontaktinformationen'"/>
    </xsl:variable>

</xsl:stylesheet>
