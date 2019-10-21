<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:fn="http://www.w3.org/2005/xpath-functions">
    <!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/diagnoses.xslt"/>
    <!-- Uncomment this line to debug  <xsl:import href="../diagnoses.xslt" /> -->
    <!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/de/dateformat_de.xslt"/>
    <!-- Uncomment this line to debug <xsl:import href="./dateformat_de.xslt" /> -->
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    
    <!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
    <xsl:param as="xs:string" name="current-locale" select="'de'"/>
    
    <xsl:variable name="Separator" as="xs:string">
        <xsl:value-of select="', %s'"/>
    </xsl:variable>
    
    <!-- displayPriority will be overwritten by the locale specific format. If true, format will display the priority of the diagnosis. -->
    <xsl:variable name="displayPriority" as="xs:boolean" select="true()"/>
	
    <!-- displayDate will be overwritten by the locale specific format. If true, format will display the diagnosis date. -->
    <xsl:variable name="displayDate" as="xs:boolean" select="true()"/>
</xsl:stylesheet>