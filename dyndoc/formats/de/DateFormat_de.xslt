<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions">
	
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'de'"/>
	
	<xsl:variable name="DATE_SEQUENCE_UTC_ON" as="xs:string" select="'dd.MM.yyyy HH:mm zzz'"/>
	<xsl:variable name="DATE_SEQUENCE_UTC_OFF" as="xs:string" select="'dd.MM.yyyy HH:mm'"/>
	<xsl:variable name="DATE_ONLY_SEQUENCE" as="xs:string" select="'dd.MM.yyyy'"/>
	<xsl:variable name="DATE_SEQUENCE_UTC_ON_WITH_TIME" as="xs:string" select="'dd.MM.yyyy hh:mm a zzz'"/>
	<xsl:variable name="DATE_SEQUENCE_UTC_ON_WITHOUT_TIME" as="xs:string" select="'dd.MM.yyyy zzz'"/>
	<xsl:variable name="DATE_SEQUENCE_UTC_OFF_WITH_TIME" as="xs:string" select="'dd.MM.yyyy hh:mm a'"/>
	<xsl:variable name="DATE_SEQUENCE_DAY" as="xs:string" select="'EEEE'"/>
	<xsl:variable name="DATE_SEQUENCE_DATE" as="xs:string" select="'d. MMM. yyyy'"/>
	<xsl:variable name="DATE_SEQUENCE_TIME" as="xs:string" select="'h:mm a zzz'"/>
	<xsl:variable name="DATE_SEQUENCE_UTC_ON_DAY" as="xs:string" select="'EEEE hh:mm a zzz'"/>
	<xsl:variable name="DATE_SEQUENCE_UTC_OFF_DAY" as="xs:string" select="'EEEE hh:mm a'"/>
	<xsl:variable name="MONTH_YEAR_SEQUENCE" as="xs:string" select="'MM.yyyy'"/>
	<xsl:variable name="YEAR_SEQUENCE" as="xs:string" select="'yyyy'"/>   

</xsl:stylesheet>