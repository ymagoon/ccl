<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
    xmlns:java-string="java:java.lang.String"
    xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
    xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
    xmlns:f="urn:footnote"
    exclude-result-prefixes="xs fn n cdocfx java-string xr-date-formatter doc">

    <!-- Global variables -->
    <xsl:variable name="quote"><![CDATA["]]></xsl:variable>
    <xsl:variable name="openSpan"><![CDATA[<span]]></xsl:variable>
    <xsl:variable name="closeSpan"><![CDATA[>]]></xsl:variable>
    <xsl:variable name="closingSpan"><![CDATA[</span>]]></xsl:variable>
    <xsl:variable name="span" as="xs:string">
        <xsl:value-of select="concat($openSpan, '%s', $closeSpan)"/>
    </xsl:variable>
    <xsl:variable name="emrInfo" as="xs:string">
        <xsl:value-of select="concat(' class=', $quote, 'ddemrinfo', $quote)"/>
    </xsl:variable>
    <!-- End of global variables -->

    <!-- Templates -->

    <!-- Emits given content wrapped in span tag with InfoType and ddemrinfo class as attributes -->
    <!-- Parameters: -->
    <!--    InfoType - text to be displayed as dd:infotype attribute -->
    <!--    Content - content to be wrapped with span tags -->
    <xsl:template name="emitEmrInfo">
        <xsl:param name="InfoType"/>
        <xsl:param name="Content"/>

        <xsl:variable name="ddInfoType" as="xs:string">
            <xsl:value-of select="concat(' dd:infotype=', $quote, $InfoType, $quote)"/>
        </xsl:variable>

        <xsl:value-of disable-output-escaping="yes" select="java-string:format($span, concat($emrInfo, $ddInfoType))"/>
        <xsl:value-of select="$Content"/>
        <xsl:value-of disable-output-escaping="yes" select="$closingSpan"/>
    </xsl:template>

    <!-- Emits given content wrapped in span tag with EntityId, InfoType and ddemrinfo class as attributes -->
    <!-- Parameters: -->
    <!--    EntityId - unique identiifier to be displayed as dd:entityid attribute -->
    <!--    InfoType - text to be displayed as dd:infotype attribute -->
    <!--    Content - content to be wrapped with span tags -->
    <xsl:template name="emitEmrInfoWithEntityId">
        <xsl:param name="EntityId"/>
        <xsl:param name="InfoType"/>
        <xsl:param name="Content"/>

        <xsl:variable name="entityId" as="xs:string">
            <xsl:value-of select="concat(' dd:entityid=', $quote, $EntityId, $quote)"/>
        </xsl:variable>

        <xsl:variable name="ddInfoType" as="xs:string">
            <xsl:value-of select="concat(' dd:infotype=', $quote, $InfoType, $quote)"/>
        </xsl:variable>

        <xsl:value-of disable-output-escaping="yes" select="java-string:format($span, concat($emrInfo, $entityId, $ddInfoType))"/>
        <xsl:value-of select="$Content"/>
        <xsl:value-of disable-output-escaping="yes" select="$closingSpan"/>
    </xsl:template>

    <!-- End of templates -->

</xsl:stylesheet>