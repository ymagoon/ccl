<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:fo="http://www.w3.org/1999/XSL/Format"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:dd="DynamicDocumentation"
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
    xmlns:java-string="java:java.lang.String"
    exclude-result-prefixes="xsl fo xs fn n dd cdocfx java-string">

    <xsl:output method="html" encoding="UTF-8" indent="yes" />
    <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

    <!-- Required to include CommonFxn.xslt -->
    <!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/patcaremeasurementcommon.xslt" />
    <!-- Uncomment this line to debug <xsl:include href="patcaremeasurementcommon.xslt" /> -->

    <xsl:variable name="AuthorCommentConnector" as="xs:string">
        <xsl:value-of select="'Comments entered by %1$s - %2$s'"/>
    </xsl:variable>

    <xsl:variable name="ShowComments" as="xs:boolean">
        <xsl:value-of select="true()"/>
    </xsl:variable>

    <xsl:variable name="NameHyphenConnector" as="xs:string">
        <xsl:value-of select="'%1$s - '"/>
    </xsl:variable>

    <!-- Get the sorted PatCareMeasurement Nodes in ascending order of event display -->
    <xsl:template match="/n:report/n:clinical-data/n:patient-care-measurement-data">
        <xsl:if test="*/n:measurement/n:event-type/@event-display">
            <xsl:perform-sort select="*/n:measurement">
                <xsl:sort select="n:event-type/@event-display" order="ascending"/>    
            </xsl:perform-sort>
        </xsl:if>
    </xsl:template>

    <xsl:template match="/"> 
        <xsl:variable name="LatestMeasurements">
            <xsl:apply-templates select="/n:report/n:clinical-data/n:patient-care-measurement-data"/>
        </xsl:variable>
        
        <xsl:if test="exists($LatestMeasurements/n:measurement)">
            <xsl:for-each select="$LatestMeasurements/n:measurement[n:event-type]">

                <xsl:variable name="DecoratedDisplayName" as="xs:string">
                    <xsl:value-of select="concat('&lt;u&gt;', n:event-type/@event-display, '&lt;/u&gt;')"/>
                </xsl:variable>

                <!-- Display measurements -->
                <div class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right" style="text-indent: -1em; padding-left: 1em;">

                    <xsl:attribute name="dd:entityid">
                        <xsl:value-of select="@event-id" />
                    </xsl:attribute>
                    <xsl:attribute name="dd:contenttype">
                        <xsl:value-of select="'PATCARE_MEAS'" />
                    </xsl:attribute>

                    <div style="float:left;">
                        <xsl:value-of disable-output-escaping="yes" select="java-string:format($NameHyphenConnector,($DecoratedDisplayName))"/>
                    </div>

                    <xsl:choose>
                        <xsl:when test="n:value/n:blob and (n:value/n:blob/@text-format = 'ESCAPED_FO')">
                            <div>
                                <xsl:call-template name="tempOutputMeasurementValueInterpretation">
                                    <xsl:with-param name="measurement" select="."/>
                                    <xsl:with-param name="dateTimeFormat" select="$DATE_SEQUENCE"/>
                                    <xsl:with-param name="dateOnlyFormat" select="$DATE_ONLY_SEQUENCE"/>
                                    <xsl:with-param name="valueUnitFormat" select="$measValueUnit"/>
                                </xsl:call-template>
                            </div>
                        </xsl:when>
                        <xsl:otherwise>
                            <span style="padding-left: 15px;">
                                <xsl:call-template name="tempOutputMeasurementValueInterpretation">
                                    <xsl:with-param name="measurement" select="."/>
                                    <xsl:with-param name="dateTimeFormat" select="$DATE_SEQUENCE"/>
                                    <xsl:with-param name="dateOnlyFormat" select="$DATE_ONLY_SEQUENCE"/>
                                    <xsl:with-param name="valueUnitFormat" select="$measValueUnit"/>
                                </xsl:call-template>
                            </span>
                        </xsl:otherwise>
                    </xsl:choose>

                    <!-- Display comments if ShowComments flag is enabled -->
                    <xsl:if test="n:comment/n:comment and $ShowComments">
                        <xsl:for-each select="n:comment">
                            <div style="padding-left: 1em;">
                                <xsl:value-of disable-output-escaping="yes" select="java-string:format($AuthorCommentConnector, (fn:string(cdocfx:getProviderNameFullByID(.[position()]/@author)), fn:string(.[position()]/n:comment)))"/>
                            </div>
                        </xsl:for-each>
                    </xsl:if>
                </div>

            </xsl:for-each>
        </xsl:if> 
    </xsl:template>
</xsl:stylesheet>